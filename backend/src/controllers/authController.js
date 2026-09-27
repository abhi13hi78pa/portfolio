import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
import qrcode from 'qrcode';
import { Admin } from '../models/Admin.js';
import bcrypt from 'bcryptjs';

const require = createRequire(import.meta.url);
const { generateSecret, generateURI, verifySync } = require('otplib');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

const getJwtRefreshSecret = () => {
  return process.env.JWT_REFRESH_SECRET || (getJwtSecret() + '_refresh');
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

export const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin.id, jti: crypto.randomUUID() },
    getJwtRefreshSecret(),
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd && process.env.COOKIE_SECURE !== 'false',
    sameSite: isProd ? 'strict' : 'lax',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, getCookieOptions());
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    ...getCookieOptions(),
    maxAge: 0,
  });
};

const generateTemp2FAToken = (id) => {
  return jwt.sign({ id, is2FAPending: true }, getJwtSecret(), {
    expiresIn: '5m',
  });
};

export const syncAdminCredentials = async () => {
  const targetEmail = process.env.ADMIN_EMAIL;
  const targetPassword = process.env.ADMIN_PASSWORD;

  if (!targetEmail || !targetPassword) {
    return;
  }

  let admin = await Admin.findOne();
  if (!admin) {
    admin = await Admin.create({
      email: targetEmail,
      password: targetPassword,
    });
    console.log(` Created initial admin account: ${targetEmail}`);
  } else {
    // Update email and password if different
    let changed = false;
    if (admin.email !== targetEmail) {
      admin.email = targetEmail;
      changed = true;
    }
    const isPassMatch = await admin.matchPassword(targetPassword);
    if (!isPassMatch) {
      admin.password = targetPassword; // Will trigger bcrypt hook in model
      changed = true;
    }
    if (changed) {
      await admin.save();
      console.log(` Admin account synchronized to: ${targetEmail}`);
    }
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if 2FA is enabled
    if (admin.twoFactorEnabled && admin.twoFactorSecret) {
      const tempToken = generateTemp2FAToken(admin.id);
      return res.json({
        require2FA: true,
        tempToken,
        message: 'Two-factor authentication code required',
      });
    }

    // Regular login
    const token = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    admin.refreshTokenHash = hashToken(refreshToken);
    await admin.save();

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      twoFactorEnabled: false,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { tempToken, code } = req.body;

    if (!tempToken || !code) {
      return res.status(400).json({ message: 'Temp token and 6-digit code are required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'default_jwt_secret');
    } catch (err) {
      return res.status(401).json({ message: '2FA session expired. Please sign in again.' });
    }

    if (!decoded.is2FAPending) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }

    const admin = await Admin.findByPk(decoded.id);
    if (!admin || !admin.twoFactorSecret) {
      return res.status(401).json({ message: '2FA is not configured for this account' });
    }

    const result = verifySync({ token: code.trim(), secret: admin.twoFactorSecret });
    const isValid = result && result.valid === true;

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid verification code. Please check your Google Authenticator app.' });
    }

    const token = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    admin.refreshTokenHash = hashToken(refreshToken);
    await admin.save();

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      twoFactorEnabled: true,
      token,
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const generate2FA = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const secret = generateSecret();
    const serviceName = 'Portfolio CMS';
    const otpauthUrl = generateURI({ issuer: serviceName, label: admin.email, secret });
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    // Save temporary secret
    admin.twoFactorSecret = secret;
    await admin.save();

    res.json({
      secret,
      qrCodeUrl,
      otpauthUrl,
    });
  } catch (error) {
    console.error('2FA generation error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const enable2FA = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Verification code is required' });
    }

    const admin = await Admin.findByPk(req.admin.id);
    if (!admin || !admin.twoFactorSecret) {
      return res.status(400).json({ message: 'Please generate a 2FA secret first' });
    }

    const result = verifySync({ token: code.trim(), secret: admin.twoFactorSecret });
    const isValid = result && result.valid === true;

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid verification code. Please check your Google Authenticator app.' });
    }

    admin.twoFactorEnabled = true;
    await admin.save();

    res.json({
      message: 'Google Authenticator 2FA enabled successfully!',
      twoFactorEnabled: true,
    });
  } catch (error) {
    console.error('2FA activation error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const disable2FA = async (req, res) => {
  try {
    const { password, code } = req.body;

    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Require password confirmation to disable
    if (!password) {
      return res.status(400).json({ message: 'Current password is required to disable 2FA' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // If code is provided, verify it as well
    if (code && admin.twoFactorSecret) {
      const result = verifySync({ token: code.trim(), secret: admin.twoFactorSecret });
      if (!result || !result.valid) {
        return res.status(400).json({ message: 'Invalid 2FA code' });
      }
    }

    admin.twoFactorEnabled = false;
    admin.twoFactorSecret = null;
    await admin.save();

    res.json({
      message: 'Google Authenticator 2FA has been disabled.',
      twoFactorEnabled: false,
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ['password', 'twoFactorSecret'] },
    });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    const admin = await Admin.findByPk(req.admin.id);
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password does not match' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(rawRefreshToken, getJwtRefreshSecret());
    } catch (err) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const admin = await Admin.findByPk(decoded.id);
    if (!admin || !admin.refreshTokenHash) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: 'Session expired or invalid user' });
    }

    // Verify token hash matches stored hash
    const incomingHash = hashToken(rawRefreshToken);
    if (admin.refreshTokenHash !== incomingHash) {
      // Refresh token reuse / compromised detected! Revoke active session
      admin.refreshTokenHash = null;
      await admin.save();
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: 'Refresh token revoked or reused' });
    }

    // Rotate refresh token and issue new access token
    const newAccessToken = generateAccessToken(admin);
    const newRefreshToken = generateRefreshToken(admin);

    admin.refreshTokenHash = hashToken(newRefreshToken);
    await admin.save();

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      token: newAccessToken,
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal error during token refresh' });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (rawRefreshToken) {
      try {
        const decoded = jwt.verify(rawRefreshToken, getJwtRefreshSecret(), { ignoreExpiration: true });
        if (decoded?.id) {
          const admin = await Admin.findByPk(decoded.id);
          if (admin) {
            admin.refreshTokenHash = null;
            await admin.save();
          }
        }
      } catch (e) {
        // Ignore verify error on logout
      }
    } else if (req.admin?.id) {
      const admin = await Admin.findByPk(req.admin.id);
      if (admin) {
        admin.refreshTokenHash = null;
        await admin.save();
      }
    }

    clearRefreshTokenCookie(res);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    clearRefreshTokenCookie(res);
    res.json({ message: 'Logged out successfully' });
  }
};

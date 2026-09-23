import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
import qrcode from 'qrcode';
import { Admin } from '../models/Admin.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const require = createRequire(import.meta.url);
const { generateSecret, generateURI, verifySync } = require('otplib');

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_jwt_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const generateTemp2FAToken = (id) => {
  return jwt.sign({ id, is2FAPending: true }, process.env.JWT_SECRET || 'default_jwt_secret', {
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

    await syncAdminCredentials();

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
    const token = generateToken(admin.id);

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

    const token = generateToken(admin.id);

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

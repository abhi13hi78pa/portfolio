import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
      const admin = await Admin.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      if (!admin) {
        return res.status(401).json({ message: 'User not found or authorization revoked' });
      }

      req.admin = admin;
      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: 'Your Name',
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Your Role',
  },
  tagline: {
    type: DataTypes.TEXT,
    defaultValue: 'Your professional introduction',
  },
  heroDescription: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  aboutHeading: {
    type: DataTypes.STRING,
    defaultValue: 'About',
  },
  aboutDescription: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  profileImageUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  resumeUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  primaryBtnText: {
    type: DataTypes.STRING,
    defaultValue: 'Download Resume',
  },
  secondaryBtnText: {
    type: DataTypes.STRING,
    defaultValue: 'View Projects',
  },
});

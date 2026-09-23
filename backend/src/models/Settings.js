import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pageTitle: {
    type: DataTypes.STRING,
    defaultValue: 'Portfolio | Full Stack Developer',
  },
  metaDescription: {
    type: DataTypes.TEXT,
    defaultValue: 'Personal developer portfolio website showcasing projects, skills, and experience.',
  },
  ogTitle: {
    type: DataTypes.STRING,
    defaultValue: 'Developer Portfolio',
  },
  ogDescription: {
    type: DataTypes.TEXT,
    defaultValue: 'Check out my latest projects and skills.',
  },
  faviconUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
});

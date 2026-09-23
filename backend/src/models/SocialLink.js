import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const SocialLink = sequelize.define('SocialLink', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  urlOrValue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

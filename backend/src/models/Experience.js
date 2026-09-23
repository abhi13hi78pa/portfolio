import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  startDate: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  endDate: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  technologies: {
    type: DataTypes.JSON,
    defaultValue: [],
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

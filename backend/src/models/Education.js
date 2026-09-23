import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Education = sequelize.define('Education', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fieldOfStudy: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  startYear: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  endYear: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  grade: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

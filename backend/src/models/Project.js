import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortTitle: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  detailedDescription: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  imageUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  techStack: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  githubUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  liveDemoUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  caseStudyUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  projectDate: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

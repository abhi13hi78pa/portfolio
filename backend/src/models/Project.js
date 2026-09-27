import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { sanitizeRichText, sanitizePlainText } from '../utils/sanitize.js';

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
}, {
  hooks: {
    beforeCreate: (project) => {
      if (project.name) project.name = sanitizePlainText(project.name);
      if (project.shortTitle) project.shortTitle = sanitizePlainText(project.shortTitle);
      if (project.description) project.description = sanitizeRichText(project.description);
      if (project.detailedDescription) project.detailedDescription = sanitizeRichText(project.detailedDescription);
    },
    beforeUpdate: (project) => {
      if (project.name) project.name = sanitizePlainText(project.name);
      if (project.shortTitle) project.shortTitle = sanitizePlainText(project.shortTitle);
      if (project.description) project.description = sanitizeRichText(project.description);
      if (project.detailedDescription) project.detailedDescription = sanitizeRichText(project.detailedDescription);
    },
  },
  indexes: [
    { fields: ['isPublished'] },
    { fields: ['displayOrder'] },
  ],
});

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { sanitizeRichText, sanitizePlainText } from '../utils/sanitize.js';

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
}, {
  hooks: {
    beforeCreate: (exp) => {
      if (exp.jobTitle) exp.jobTitle = sanitizePlainText(exp.jobTitle);
      if (exp.company) exp.company = sanitizePlainText(exp.company);
      if (exp.location) exp.location = sanitizePlainText(exp.location);
      if (exp.description) exp.description = sanitizeRichText(exp.description);
    },
    beforeUpdate: (exp) => {
      if (exp.jobTitle) exp.jobTitle = sanitizePlainText(exp.jobTitle);
      if (exp.company) exp.company = sanitizePlainText(exp.company);
      if (exp.location) exp.location = sanitizePlainText(exp.location);
      if (exp.description) exp.description = sanitizeRichText(exp.description);
    },
  },
  indexes: [
    { fields: ['displayOrder'] },
    { fields: ['isActive'] },
  ],
});

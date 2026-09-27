import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { sanitizeRichText, sanitizePlainText } from '../utils/sanitize.js';

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
}, {
  hooks: {
    beforeCreate: (edu) => {
      if (edu.institution) edu.institution = sanitizePlainText(edu.institution);
      if (edu.degree) edu.degree = sanitizePlainText(edu.degree);
      if (edu.fieldOfStudy) edu.fieldOfStudy = sanitizePlainText(edu.fieldOfStudy);
      if (edu.grade) edu.grade = sanitizePlainText(edu.grade);
      if (edu.description) edu.description = sanitizeRichText(edu.description);
    },
    beforeUpdate: (edu) => {
      if (edu.institution) edu.institution = sanitizePlainText(edu.institution);
      if (edu.degree) edu.degree = sanitizePlainText(edu.degree);
      if (edu.fieldOfStudy) edu.fieldOfStudy = sanitizePlainText(edu.fieldOfStudy);
      if (edu.grade) edu.grade = sanitizePlainText(edu.grade);
      if (edu.description) edu.description = sanitizeRichText(edu.description);
    },
  },
  indexes: [
    { fields: ['displayOrder'] },
  ],
});

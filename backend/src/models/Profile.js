import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { sanitizeRichText, sanitizePlainText } from '../utils/sanitize.js';

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
}, {
  hooks: {
    beforeCreate: (profile) => {
      if (profile.name) profile.name = sanitizePlainText(profile.name);
      if (profile.role) profile.role = sanitizePlainText(profile.role);
      if (profile.tagline) profile.tagline = sanitizeRichText(profile.tagline);
      if (profile.heroDescription) profile.heroDescription = sanitizeRichText(profile.heroDescription);
      if (profile.aboutHeading) profile.aboutHeading = sanitizePlainText(profile.aboutHeading);
      if (profile.aboutDescription) profile.aboutDescription = sanitizeRichText(profile.aboutDescription);
    },
    beforeUpdate: (profile) => {
      if (profile.name) profile.name = sanitizePlainText(profile.name);
      if (profile.role) profile.role = sanitizePlainText(profile.role);
      if (profile.tagline) profile.tagline = sanitizeRichText(profile.tagline);
      if (profile.heroDescription) profile.heroDescription = sanitizeRichText(profile.heroDescription);
      if (profile.aboutHeading) profile.aboutHeading = sanitizePlainText(profile.aboutHeading);
      if (profile.aboutDescription) profile.aboutDescription = sanitizeRichText(profile.aboutDescription);
    },
  },
});

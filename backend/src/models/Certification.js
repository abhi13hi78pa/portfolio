import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Certification = sequelize.define('Certification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  issuingOrg: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  issueDate: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  credentialId: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  credentialUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  certificateFileUrl: {
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
}, {
  indexes: [
    { fields: ['displayOrder'] },
    { fields: ['isActive'] },
  ],
});

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General',
  },
  proficiency: {
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

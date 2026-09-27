import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  const tableInfo = await queryInterface.describeTable('Admins');
  if (!tableInfo.refreshTokenHash) {
    await queryInterface.addColumn('Admins', 'refreshTokenHash', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
    console.log('✅ Added refreshTokenHash column to Admins table.');
  }
};

export const down = async ({ context: queryInterface }) => {
  const tableInfo = await queryInterface.describeTable('Admins');
  if (tableInfo.refreshTokenHash) {
    await queryInterface.removeColumn('Admins', 'refreshTokenHash');
  }
};

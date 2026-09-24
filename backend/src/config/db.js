import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Parse credentials from individual vars or DATABASE_URL
let dbUser = process.env.DB_USER || 'root';
let dbPassword = process.env.DB_PASSWORD || '';
let dbHost = process.env.DB_HOST || 'localhost';
let dbPort = Number(process.env.DB_PORT) || 3306;
let dbName = process.env.DB_NAME || 'portfolio';

if (process.env.DATABASE_URL && (!process.env.DB_USER || !process.env.DB_PASSWORD)) {
  try {
    const rawUrl = process.env.DATABASE_URL;
    const withoutProtocol = rawUrl.replace(/^mysql:\/\//, '');
    const lastSlashIdx = withoutProtocol.lastIndexOf('/');
    if (lastSlashIdx !== -1) {
      dbName = withoutProtocol.substring(lastSlashIdx + 1).split('?')[0];
    }
    const hostAndAuth = withoutProtocol.substring(0, lastSlashIdx);
    const lastAtIdx = hostAndAuth.lastIndexOf('@');
    if (lastAtIdx !== -1) {
      const auth = hostAndAuth.substring(0, lastAtIdx);
      const hostPort = hostAndAuth.substring(lastAtIdx + 1);
      const [u, ...pParts] = auth.split(':');
      dbUser = decodeURIComponent(u);
      dbPassword = decodeURIComponent(pParts.join(':'));
      const [h, p] = hostPort.split(':');
      dbHost = h;
      if (p) dbPort = Number(p);
    }
  } catch (err) {
    console.warn('Could not parse DATABASE_URL, using default/individual env vars', err);
  }
}

const isRemote = dbHost !== 'localhost' && dbHost !== '127.0.0.1';
const useSSL = process.env.DB_SSL === 'true' || (isRemote && process.env.DB_SSL !== 'false');

const dialectOptions = useSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  dialectOptions,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
  },
});

export let isDbConnected = false;

export const connectDB = async () => {
  try {
    // 1. Attempt to ensure database exists (works on local MySQL and cloud instances where user has create permissions)
    try {
      const connectionConfig = {
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
      };
      if (useSSL) {
        connectionConfig.ssl = { rejectUnauthorized: false };
      }
      const connection = await mysql.createConnection(connectionConfig);
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await connection.end();
      console.log(` MySQL database '${dbName}' verified/created.`);
    } catch (createErr) {
      // In cloud providers like PlanetScale/Aiven, DB is pre-created and CREATE DATABASE may be restricted
      console.log(` Notice: Database creation check skipped or pre-existing (${createErr.message})`);
    }

    // 2. Authenticate Sequelize and sync tables
    await sequelize.authenticate();
    console.log(` Sequelize connected successfully to MySQL at ${dbHost}:${dbPort}`);

    await sequelize.sync({ alter: true });
    console.log(' Database tables synchronized.');
    isDbConnected = true;
  } catch (error) {
    isDbConnected = false;
    console.error(' MySQL Database connection failed:', error.message);
    throw error;
  }
};

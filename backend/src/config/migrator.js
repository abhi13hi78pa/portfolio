import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../migrations');

let _migratorInstance = null;

export const getMigrator = () => {
  if (!_migratorInstance) {
    _migratorInstance = new Umzug({
      migrations: {
        glob: ['*.js', { cwd: migrationsDir }],
      },
      context: () => sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });
  }
  return _migratorInstance;
};

export const runMigrations = async () => {
  try {
    const migrator = getMigrator();
    const pending = await migrator.pending();
    if (pending.length > 0) {
      console.log(`⚙️ Executing ${pending.length} pending database migration(s)...`);
      const executed = await migrator.up();
      console.log(`✅ Applied ${executed.length} migration(s) successfully.`);
      return executed;
    } else {
      console.log('✅ Database schema is up-to-date (no pending migrations).');
      return [];
    }
  } catch (error) {
    console.error('❌ Migration execution failed:', error.message);
    throw error;
  }
};

// If run directly via `node src/config/migrator.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  sequelize.authenticate()
    .then(() => runMigrations())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

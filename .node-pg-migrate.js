require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

module.exports = {
  migrationFolder: 'migrations',
  direction: 'up',
  driver: 'pg',
  databaseUrl: process.env.DATABASE_URL,
};

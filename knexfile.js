const path = require('path');

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'reddit-clone',
    migrations: {
      directory: path.join(__dirname, 'app', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'app', 'seeds'),
    },
  },

  test: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_URL || 'reddit-clone-test',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, 'app', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'app', 'seeds'),
    },
  },

};

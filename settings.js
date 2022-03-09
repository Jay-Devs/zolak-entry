const path = require('path');
const pjson = require(path.join(__dirname, './package.json'));

const Settings = {
  DEFAULT: {
    env: 'production',
    name: pjson.description || pjson.name,
    version: pjson.version,    
    debug: false,
    paths: {
      databaseModels: path.join(__dirname, './models'),
    },
    database: {
      database: process.env.MONGODB_URI,
      dialect: 'mongodb',
    },
  },

  LOCAL: {
    env: 'development',
    name: pjson.description || pjson.name,
    version: pjson.version,        
    debug: true,
    paths: {
      databaseModels: path.join(__dirname, './models'),
    },
    database: {
      database: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zolak-entry',
      dialect: 'mongodb',
    },
  },

  get: () => {
    let env = (process.env.NODE_ENV || '').toLowerCase();

    return Object.values(Settings).find((settings) => (settings['env'] == env)) || Settings.DEFAULT;
  },
}

module.exports = Settings.get();

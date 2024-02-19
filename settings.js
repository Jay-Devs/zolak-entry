const path = require('path');
const pjson = require(path.join(__dirname, './package.json'));

const parseMongoUri = () => {
  const mongodb_host = process.env.MONGODB_HOST
  const mongodb_port = process.env.MONGODB_PORT || 27017
  const mongodb_database = process.env.MONGODB_DATABASE
  const replicaSet = process.env.MONGODB_REPLICA_SET

  if (replicaSet) {
    return `mongodb://${mongodb_host}:${mongodb_port}/${mongodb_database}?replicaSet=${replicaSet}`
  }

  return `mongodb://${mongodb_host}:${mongodb_port}/${mongodb_database}`
}

const Settings = {
  env: 'production',
  name: pjson.description || pjson.name,
  version: pjson.version,
  debug: false,
  mongodb: {
    uri: parseMongoUri(),
  },
}

module.exports = Settings;

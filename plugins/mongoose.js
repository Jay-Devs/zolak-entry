const fs = require('fs');
const fp = require('fastify-plugin');
const mongoose = require('mongoose');
const settings = require('@settings');

const FileSystem = require('@controllers/FileSystem');
const SPACES = require('@utils/enums/spaces');

module.exports = fp(async (fastify) => {
  const mongooseConnection = await mongoose.connect(settings.database.database, { useNewUrlParser: true, useFindAndModify: false });
  const modelsPath = FileSystem.resolvePath(SPACES.DATABASE_MODELS);

  fs.readdirSync(modelsPath).forEach((file) => {
    require(`${modelsPath}/${file}`)(mongoose, mongooseConnection);
  });

  fastify.register(require('fastify-swagger'), {
    swagger: {
      info: {
        title: 'Test swagger',
        description: 'testing the fastify swagger api',
        version: '0.1.0',
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
      host: 'localhost:3001',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
    exposeRoute: true,
  });
});

const fp = require('fastify-plugin');
const mongoose = require('mongoose');
const settings = require('@settings');

module.exports = fp(async () => {
  await mongoose.connect(settings.mongodb.uri);
});

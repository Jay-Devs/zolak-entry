const path = require('path');
const autoload = require('fastify-autoload');
const fp = require('fastify-plugin');

require('module-alias/register');

async function registerPlugins(server, opts) {
  server
    .register(autoload, {
      dir: path.join(__dirname, 'plugins'),
      options: { ...opts },
    })
    .register(autoload, {
      dir: path.join(__dirname, 'routes/api'),
      options: { ...opts },
      dirNameRoutePrefix: false,
    });
}

module.exports = fp(registerPlugins);

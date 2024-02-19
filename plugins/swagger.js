const fp = require('fastify-plugin');

module.exports = fp(async (fastify) => {
    fastify.register(require('@fastify/swagger'), {
        swagger: {
            info: {
                title: 'Test swagger',
                description: 'testing the fastify swagger api',
                version: '0.1.0',
            },
            host: 'localhost:3001',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
        },
        exposeRoute: true,
    });
    fastify.register(require('@fastify/swagger-ui'), {
        routePrefix: "/docs",
        exposeRoute: true,
    });
});

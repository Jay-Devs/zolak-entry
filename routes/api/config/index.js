const mongoose = require('mongoose');
const settings = require('@settings');

const { onErrorHandler } = require('@utils');

const Config = require('../../../models/Config')
const prefix = '/api/config';

const customErrorHandler = (status, msg) => {
  const error = new Error(msg);
  error.status = status;

  return error;
};

module.exports = async (fastify) => {
  fastify.post(
    `${prefix}/get`,
    {
      schema: {
        description: 'post body to query config results',
        summary: 'get configs',
        body: {
          type: 'object',
          properties: {
            application: {
              type: 'object',
              properties: {
                identifier: { type: 'string' },
                version: { type: 'string' }
              }
            }
          }
        },
        response: {
          500: {
            description: 'Something went wrong',
            type: 'string',
            example: 'Internal server error'
          },
          404: {
            description: 'Not found',
            type: 'string',
            example: 'Config not found'
          }
        },
      }
    },
    async (request, reply) => {
      try {
        const appendQuery = (query, path, object) => {
          if (typeof object !== 'object') {
            return;
          }

          Object.entries(object).forEach(([key, value]) => {
            const queryPath = `${path}.${key}`;

            if (typeof value === 'object' && !Array.isArray(value)) {
              appendQuery(query, queryPath, value);
              return;
            }

            query[queryPath] = value;
          });

          return query;
        }
        query = appendQuery({}, 'attributes', request.body);
        query['active'] = true;

        const config = await Config.findOne(query);

        if (!config) {
          return customErrorHandler(404, 'Config not found');
        }

        return config['config'];
      } catch (error) {
        return onErrorHandler(reply, error);
      }
    }
  );
};

const BaseRoute = require('../BaseRoute');
const Joi = require('joi');

const failAction = (req, res, error) => {
  throw error;
};

const query = Joi.object({
  skip: Joi.number().default(0),
  limit: Joi.number().default(10),
  name: Joi.string().min(3).max(100),
});

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/heroes',
      method: 'GET',
      options: {
        validate: {
          query,
          headers,
          failAction,
        },
        handler: {},
      },
    };
  }
}

module.exports = HeroRoutes;

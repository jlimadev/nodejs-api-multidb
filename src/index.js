const Hapi = require('@hapi/hapi');

const app = new Hapi.Server({
  port: process.env.PORT,
});

const deps = {
  app,
};

module.exports.handler = require('./core')(deps);
module.exports.deps = deps;

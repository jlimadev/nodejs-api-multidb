const Hapi = require('@hapi/hapi');
const server = require('./core');

const app = new Hapi.Server({
  port: process.env.PORT,
});

const deps = {
  app,
};

module.exports.handler = server(deps);

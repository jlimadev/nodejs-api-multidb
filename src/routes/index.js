const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const ContextStrategy = require('../db/strategies/context/ContextStrategy');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const heroRoutes = require('./hero-routes');
const heroRoutesValidations = require('../utils/celebrate-validations/heroRoutesValidations');
const authRoutes = require('./auth-routes');

const {
  authPostgresConnection,
  authPostgresStrategy,
} = require('../db/strategies/postgres/buildPostgresConnections');

const {
  heroesMongoConnection,
  heroesMongoStrategy,
} = require('../db/strategies/mongodb/buildMongoConnections');

const AuthRoutesController = require('../controllers/AuthRoutesController/');
const authRoutesController = new AuthRoutesController(authPostgresStrategy);

const HeroRoutesController = require('../controllers/HeroRoutesController');
const heroRoutesController = new HeroRoutesController(heroesMongoStrategy);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/heroes', heroRoutes(heroRoutesController, heroRoutesValidations));

app.use(
  '/authenticate',
  authRoutes(authRoutesController, heroRoutesValidations),
);
app.use(errors());

module.exports = { app, heroesMongoConnection, authPostgresConnection };

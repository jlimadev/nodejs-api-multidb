const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const { sign } = require('jsonwebtoken');
const heroRoutes = require('./hero-routes');
const passwordHelper = require('../utils/password-helper');
const heroRoutesValidations = require('../utils/celebrate-validations/heroRoutesValidations');
const authRoutesValidations = require('../utils/celebrate-validations/authRoutesValidations');
const authRoutes = require('./auth-routes');

const {
  authPostgresConnection,
  authPostgresStrategy,
} = require('../db/strategies/postgres/buildPostgresConnections');

const {
  heroesMongoConnection,
  heroesMongoStrategy,
} = require('../db/strategies/mongodb/buildMongoConnections');

const secret = process.env.JWT_SECRET;

const AuthRoutesController = require('../controllers/AuthRoutesController/');
const authRoutesController = new AuthRoutesController({
  secret: secret,
  db: authPostgresStrategy,
  passwordHelper: passwordHelper,
  jwtSign: sign,
});

const HeroRoutesController = require('../controllers/HeroRoutesController');
const heroRoutesController = new HeroRoutesController(heroesMongoStrategy);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes(authRoutesController, authRoutesValidations));
app.use('/heroes', heroRoutes(heroRoutesController, heroRoutesValidations));
app.use(errors());

module.exports = { app, heroesMongoConnection, authPostgresConnection };

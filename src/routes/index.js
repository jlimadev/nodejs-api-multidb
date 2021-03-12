const express = require('express');
const { errors } = require('celebrate');
const cors = require('cors');

const heroRoutes = require('./hero-routes');
const heroRoutesValidations = require('../utils/celebrate-validations/heroRoutesValidations');

// Database strategy
const ContextStrategy = require('../db/strategies/context/ContextStrategy');

// MongoDB strategy and instances
const MongoDB = require('../db/strategies/mongodb/mongodb');
const mongoHeroesSchema = require('../db/strategies/mongodb/schemas/heroesSchema');
const mongoConnection = MongoDB.connect();
const mongoDBInstance = new MongoDB(mongoConnection, mongoHeroesSchema);
const mongoStrategy = new ContextStrategy(mongoDBInstance);

// Hero Routes controller Instances
const HeroRoutesController = require('../controllers/HeroRoutesController');
const heroRoutesController = new HeroRoutesController(mongoStrategy);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/heroes', heroRoutes(heroRoutesController, heroRoutesValidations));
app.use(errors());

module.exports = { app, mongoConnection };

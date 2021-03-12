const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const ContextStrategy = require('../db/strategies/context/ContextStrategy');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const heroRoutesValidations = require('../utils/celebrate-validations/heroRoutesValidations');
const heroRoutes = require('./hero-routes');

// MongoDB strategy and instances
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

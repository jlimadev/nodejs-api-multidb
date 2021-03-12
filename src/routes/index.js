const express = require('express');
const { errors } = require('celebrate');
const cors = require('cors');
const defineHeroRoutes = require('./HeroRoutes/defineHeroRoutes');

const ContextStrategy = require('../db/strategies/context/ContextStrategy');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const mongoHeroesSchema = require('../db/strategies/mongodb/schemas/heroesSchema');
const mongoConnection = MongoDB.connect();
const mongoDBInstance = new MongoDB(mongoConnection, mongoHeroesSchema);
const mongoStrategy = new ContextStrategy(mongoDBInstance);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/heroes', defineHeroRoutes(mongoStrategy));
app.use(errors());

module.exports = { app, mongoConnection };

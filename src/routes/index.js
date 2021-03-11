const express = require('express');
const cors = require('cors');
const heroesRouter = require('./HeroRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/heroes', heroesRouter);

module.exports = app;

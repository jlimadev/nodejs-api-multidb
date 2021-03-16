const cors = require('cors');
const express = require('express');
const { errors } = require('celebrate');
const { sign } = require('jsonwebtoken');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const heroRoutes = require('./routes/hero-routes');
const authRoutes = require('./routes/auth-routes');
const passwordHelper = require('./utils/password-helper');
const heroRoutesValidations = require('./utils/celebrate-validations/heroRoutesValidations');
const authRoutesValidations = require('./utils/celebrate-validations/authRoutesValidations');

const HeroRoutesController = require('./controllers/HeroRoutesController');
const AuthRoutesController = require('./controllers/AuthRoutesController');
const mongoConnections = require('./db/strategies/mongodb/buildMongoConnections');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Heroes API',
      description: 'CRUD application to heroes',
    },
    servers: [{ url: 'http://localhost:4000' }],
  },
  apis: ['src/routes/specs/openapi.yaml'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const {
  mongoConnection,
  heroesMongoStrategy,
  authMongoStrategy,
} = mongoConnections;

const secret = process.env.JWT_SECRET;

const authRoutesController = new AuthRoutesController({
  secret: secret,
  db: authMongoStrategy,
  passwordHelper: passwordHelper,
  jwtSign: sign,
});

const heroRoutesController = new HeroRoutesController({
  db: heroesMongoStrategy,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/auth', authRoutes(authRoutesController, authRoutesValidations));
app.use('/heroes', heroRoutes(heroRoutesController, heroRoutesValidations));
app.use(errors());

module.exports = { app, mongoConnection };

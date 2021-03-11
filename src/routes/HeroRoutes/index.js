const { Router } = require('express');
const heroesRouter = Router();

const listHeroes = (req, res) => {
  res.json({ message: 'hello world' });
};

heroesRouter.get('/', listHeroes);

module.exports = heroesRouter;

const defineEnvironment = require('./utils/define-environment');

const env = process.env.NODE_ENV || 'devl';
defineEnvironment(env);

const { app } = require('.');

const port = process.env.PORT || 4000;
const url = process.env.URL || 'http://localhost';

app.listen(port, () => {
  console.log(`Express server is running on ${url}:${port}`);
});

const defineEnvironment = require('./utils/define-environment');
const env = process.env.NODE_ENV || 'devl';
defineEnvironment(env);

const { app } = require('.');

const port = process.env.PORT;
const url = process.env.URL;

app.listen(port, () => {
  console.log(`Express server is running on ${url}:${port}`);
});

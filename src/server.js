const defineEnvironment = require('./utils/defineEnvironment');
const env = process.env.NODE_ENV || 'devl';
defineEnvironment(env);

const app = require('./routes');
const port = process.env.PORT;
const url = process.env.URL;

app.listen(port, () => {
  console.log(`Express server is running on ${url}:${port}`);
});

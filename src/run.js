const env = process.env.NODE_ENV || 'devl';
const defineEnvironment = require('./utils/defineEnvironment');
defineEnvironment(env);
const { handler } = require('./index');
handler();

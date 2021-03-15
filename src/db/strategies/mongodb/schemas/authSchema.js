const Mongoose = require('mongoose');
const { v4 } = require('uuid');

const modelName = 'auth';

const authSchema = new Mongoose.Schema(
  {
    _id: { type: String, required: true, default: v4 },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { strict: false },
);

const authModel = Mongoose.models[modelName]
  ? Mongoose.model(modelName)
  : Mongoose.model(modelName, authSchema);

module.exports = authModel;

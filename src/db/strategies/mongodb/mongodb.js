const ICrud = require('../interfaces/ICrud');
const Mongoose = require('mongoose');

class MongoDB extends ICrud {
  constructor(connection, schema, generateUuid) {
    super();

    if (!connection || !schema || !generateUuid)
      throw new Error('You must inject the dependecies');

    this._connection = connection;
    this._schema = schema;
    this._generateUuid = generateUuid;
  }

  async create(item) {
    if (!item) {
      throw new Error('You must inform the item to be inserted');
    }

    try {
      return await this._schema.create(item);
    } catch (error) {
      const errorMessage = 'Error creating data on mongoDB';
      throw Error(errorMessage);
    }
  }

  async read(item, skip = 0, limit = 10) {
    try {
      return await this._schema.find(item).skip(skip).limit(limit);
    } catch (error) {
      const errorMessage = 'Error getting data from mongoDB';
      throw Error(errorMessage);
    }
  }

  async update(id, item, upsert = false) {
    if (!id && !upsert)
      throw new Error('You must inform the UUID to be updated');

    if (!item) throw new Error('You must inform the item to be updated');

    try {
      const query = id ? { _id: id } : { _id: this._generateUuid() };
      const updateValue = { $set: item };
      const options = upsert
        ? {
            new: true,
            upsert: true,
            rawResult: true,
            setDefaultsOnInsert: true,
          }
        : {};

      return await this._schema.updateOne(query, updateValue, options);
    } catch (error) {
      const errorMessage = 'Error updating data on mongoDB';
      throw Error(errorMessage);
    }
  }

  async delete(id) {
    try {
      return id
        ? await this._schema.deleteOne({ _id: id })
        : await this._schema.deleteMany({});
    } catch (error) {
      const errorMessage = 'Error deleting data on mongoDB';
      throw Error(errorMessage);
    }
  }

  static connect() {
    try {
      const uri = 'mongodb://jlimadev:secretpass@localhost:27017/heroes';
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      };

      Mongoose.connect(uri, options);

      const connection = Mongoose.connection;

      return connection;
    } catch (error) {
      const errorMessage = 'Error on connect with MongoDB';
      throw Error(errorMessage);
    }
  }

  static async disconnect() {
    try {
      await Mongoose.disconnect();
      return true;
    } catch (error) {
      const errorMessage = 'Error on close connection with MongoDB';
      throw Error(errorMessage);
    }
  }
}

module.exports = MongoDB;

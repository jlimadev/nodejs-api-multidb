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
      throw Error(error.message);
    }
  }

  async read(item, skip = 0, limit = 10) {
    try {
      return await this._schema.find(item).skip(skip).limit(limit);
    } catch (error) {
      throw Error(error.message);
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
      throw Error(error.message);
    }
  }

  async delete(id) {
    try {
      return id
        ? await this._schema.deleteOne({ _id: id })
        : await this._schema.deleteMany({});
    } catch (error) {
      throw Error(error.message);
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
      throw Error(error.message);
    }
  }

  static async disconnect() {
    try {
      await Mongoose.disconnect();
      return true;
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = MongoDB;

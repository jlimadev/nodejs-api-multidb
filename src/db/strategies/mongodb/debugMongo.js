const MongoDB = require('./mongodb');
const heroesSchema = require('./schemas/heroesSchema');
const ContextStrategy = require('../context/ContextStrategy');
const { v4 } = require('uuid');

const call = async () => {
  const connection = MongoDB.connect();
  const mongodb = new ContextStrategy(
    new MongoDB(connection, heroesSchema, v4),
  );
  // await mongodb.create({ name: 'Jon', power: 'Nainha' });
  // await mongodb.create({ name: 'Jon', power: 'Nainha' });
  // const result = await mongodb.read();

  //UPDATE
  // const result = await mongodb.update('19cb7c30-da60-45e4-b6ea-0a1f889da84c', {
  //   name: 'Jon',
  //   power: 'Tureco',
  // });

  //UPSERT;
  const result = await mongodb.update(
    null,
    {
      name: 'Naruto',
      power: 'Show',
    },
    true,
  );

  console.log(result);
  // const result = await mongodb.delete();
  await MongoDB.disconnect();
};

call();

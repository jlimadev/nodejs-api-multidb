# API with a multi-database strategy

Using Strategy Design Pattern to implement a multi-database project and mocha/chai to test.

The API was made with `express` and dynamic validation with `celebrate`.

To generate the swagger was used `swagger-ui-express` and `swagger-jsdoc` with `OpenAPI v3`.

And last but not least, the JWT token authentication. This authentication was built with `jsonwebtoken` to generate/validate the token. We heave one middleware to check the authentication on private routes.

For this project you can use Postgres or MongoDB, but if you want to add any other database, feel free to do it.

## Strategy Design Pattern

In this repository we use the Strategy Design Pattern to deal with multi-database

- For Postgres database we used the `Sequelize`
- For MongoDB database we used `Mongoose`

## Docker

Bellow the docker commands used to create it.

### Postgres Database

```
docker run \
 --name nodebr-postgres \
 -e POSTGRES_USER=root \
 -e POSTGRES_PASSWORD=root \
 -e POSTGRES_DB=heroes \
 -p 5432:5432 \
 -d \
 postgres
```

List containers: `docker ps`, then enter in bin/bash of container and run `psql` command inside container.

To run PSQL command inside container: LINUX/MAC: `docker exec -it nodebr-postgres /bin/bash`. WINDOWS: `winpty docker exec -it nodebr-postgres //bin//bash`

### Adminer

```
docker run \
 --name adminer-nodebr \
 -p 8080:8080 \
 --link nodebr-postgres:nodebr-postgres \
 - d\
 adminer
```

We can also use DBeaver or PGAdmin to access our postgres.
With postgres we must install dependencies bellow:

`yarn add sequelize pg-hstore pg`

### MongoDB

```
docker run \
  --name nodebr-mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=root \
  -p 27017:27017 \
  - d \
  mongo
```

Create db and user via CLI

```
docker exec -it nodebr-mongodb \
  mongo --host localhost -u root -p root --authenticationDatabase admin \
  --eval "db.getSiblingDB('heroes').createUser({user: 'jlimadev', pwd: 'secretpass', roles: [{role: 'readWrite', db: 'heroes'}]})"
```

### MongoClient

```
docker run \
  --name mongoclient-nodebr \
  -p 3000:3000 \
  --link nodebr-mongodb:nodebr-mongodb \
  -d \
  mongoclient/mongoclient
```

We can also use MongoDBCompass

### Cloud Mongo DB (PROD)

PROD database with cloud.mongodb.com from mlabs.

### Deployment

This App is deployed on Heroku.

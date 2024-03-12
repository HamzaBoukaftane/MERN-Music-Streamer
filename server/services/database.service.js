/*
* This JS file contains a DataBaseService class
* which contains methods to connect to the DB and
* fill it up if its empty.
* file database.service.js
* Authors Hamza Boukaftane and Arman Lidder
* date     1  april 2023
* Modified 11 april 2023
*/

const { MongoClient } = require('mongodb');
const DB_CONSTS = require("../utils/env");

class DatabaseService {
  async populateDb (collectionName, data) {
    const collection = await this.db.collection(collectionName);
    const isDBEmpty = (await collection.findOne() === null);
    if (isDBEmpty) {
      await collection.insertMany(data);
    }
  }

  async connectToServer (uri) {
    try {
      this.client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await this.client.connect();
      this.db = this.client.db(DB_CONSTS.DB_DB);
      // eslint-disable-next-line no-console
      console.log('Successfully connected to MongoDB.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}

const dbService = new DatabaseService();

module.exports = { dbService };

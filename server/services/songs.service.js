/*
* This JS file contains a SongService class
* which contains methods to manage the songs
* within the DataBase.
* file songs.service.js
* Authors Hamza Boukaftane and Arman Lidder
* date     1  april 2023
* Modified 11 april 2023
*/

const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
const DB_CONSTS = require("../utils/env");

const path = require("path");

class SongService {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
  }

  get collection () {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_SONGS);
  }

  async getAllSongs () {
    return await this.collection.find({}).toArray();
  }

  async getSongById (id) {
    return await this.collection.findOne({ id: parseInt(id) });
  }

  async updateSongLike (id) {
    const song = await this.getSongById(id);
    await this.collection.updateOne({ id: song.id }, { "$set": { liked: !song.liked } });
    return !song.liked;
  }

  async search (substring, exact) {
    return await this.findItems(this.generateFilter(substring, exact));
  }

  generateFilter (substring, exact) {
    if (exact) {
      return [
        { name: { $regex: `${substring}` } },
        { artist: { $regex: `${substring}` } },
        { genre: { $regex: `${substring}` } }
      ];
    } else {
      return [
        { name: { $regex: `${substring}`, $options: "i" } },
        { artist: { $regex: `${substring}`, $options: "i" } },
        { genre: { $regex: `${substring}`, $options: "i" } }
      ];
    }
  }

  async findItems (filter) {
    return await this.collection.find({ $or: filter }).toArray();
  }

  async populateDb () {
    const songs = JSON.parse(await this.fileSystemManager.readFile(this.JSON_PATH)).songs;
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_SONGS, songs);
  }
}

module.exports = { SongService };

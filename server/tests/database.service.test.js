const { MongoMemoryServer } = require("mongodb-memory-server");
const { dbService } = require("../services/database.service");
const DB_CONSTS = require("../utils/env");

describe("Database tests", () => {
  let mongoServer;
  let uri = "";
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  });

  afterEach(async () => {
    await dbService.client.close();
    await mongoServer.stop();
  });

  it("should connect to the database", async () => {
    await dbService.connectToServer(uri);
    expect(dbService.client).not.toBeUndefined();
  });

  it("should not connect to the database with invalid URI", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await dbService.connectToServer("bad-uri");
    expect(spy).toHaveBeenCalled();
  });

  it("should populate a collection", async () => {
    const song1 = {
      id: 0,
      name: "Test",
      artist: "prazkhanal",
      src: "./assets/media/01_song.mp3",
      genre: "Electronic",
      liked: false,
    };
    const song2 = {
      id: 1,
      name: "Overflow",
      artist: "Piano Amor",
      src: "./assets/media/02_song.mp3",
      genre: "Classic",
      liked: false,
    };

    const collectionName = DB_CONSTS.DB_COLLECTION_SONGS;
    await dbService.connectToServer(uri);
    await dbService.db.createCollection(collectionName);
    await dbService.populateDb(collectionName, [song1, song2]);
    const insertedElements = await dbService.db.collection(collectionName).find({}).toArray();
    expect(insertedElements.length).toEqual(2);
    expect(insertedElements).toEqual([song1, song2]);
  });

  it("should not populate a collection if data exsits", async () => {
    const song1 = {
      id: 0,
      name: "Test",
      artist: "prazkhanal",
      src: "./assets/media/01_song.mp3",
      genre: "Electronic",
      liked: false,
    };
    const song2 = {
      id: 1,
      name: "Overflow",
      artist: "Piano Amor",
      src: "./assets/media/02_song.mp3",
      genre: "Classic",
      liked: false,
    };

    const collectionName = DB_CONSTS.DB_COLLECTION_SONGS;
    await dbService.connectToServer(uri);
    await dbService.db.createCollection(collectionName);
    await dbService.db.collection(collectionName).insertOne(song1);
    await dbService.populateDb(collectionName, [song1, song2]);
    const insertedElements = await dbService.db.collection(collectionName).find({}).toArray();
    expect(insertedElements.length).toEqual(1);
    expect(insertedElements).toEqual([song1]);
  });
});

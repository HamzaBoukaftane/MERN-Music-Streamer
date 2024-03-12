const { MongoMemoryServer } = require("mongodb-memory-server");

const { SongService } = require("../services/songs.service");
const { dbService } = require("../services/database.service");
const DB_CONSTS = require("../utils/env");

const songs = require("../data/songs.json").songs;

describe("Songs Service", () => {
  let mongoServer;
  let uri = "";
  const collectionName = DB_CONSTS.DB_COLLECTION_SONGS;
  let songService;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    await dbService.connectToServer(uri);
    await dbService.db.createCollection(collectionName);
    await dbService.db.collection(collectionName).insertMany([songs[0], songs[1]]);
    songService = new SongService();
    songService.dbService = dbService;
  });

  afterEach(async () => {
    await dbService.client.close();
    await mongoServer.stop();
  });

  it("getAllSongs should return all songs", async () => {
    const allSongs = await songService.getAllSongs();
    expect(allSongs.length).toEqual(2);
  });

  it("getSongById should return a song based on its id", async () => {
    const song = await songService.getSongById(songs[0].id);
    expect(song).toEqual(songs[0]);
  });

  it("updateSongLike should update the like status of a song", async () => {
    const songLikedStatus = songs[0].liked;
    await songService.updateSongLike(0);
    const song = await songService.getSongById(0);
    expect(song.liked).not.toEqual(songLikedStatus);
  });

  it("updateSongLike should toggle the like status of a song on multiple songs", async () => {
    const songOriginalStatus = songs[0].liked;
    await songService.updateSongLike(0);
    let song = await songService.getSongById(0);
    expect(song.liked).not.toEqual(songOriginalStatus);

    await songService.updateSongLike(0);
    song = await songService.getSongById(0);
    expect(song.liked).toEqual(songOriginalStatus);
  });

  it("search should return all songs matching the search string", async () => {
    const searchString = "ic";
    const exact = false;
    const searchResults = await songService.search(searchString, exact);
    expect(searchResults).toEqual([songs[0], songs[1]]);
  });

  it("search should return all songs matching the search string with exact search", async () => {
    const searchString = "w";
    const exact = true;
    const searchResults = await songService.search(searchString, exact);
    expect(searchResults).toEqual([songs[1]]);
  });

  it("search should return no songs matching the search string with exact search and no hits", async () => {
    const searchString = "rock";
    const exact = true;
    const searchResults = await songService.search(searchString, exact);
    expect(searchResults).toEqual([]);
  });

  it("should call populateDb() of DatabaseService", async () => {
    const spy = jest.spyOn(songService.dbService, "populateDb").mockImplementation(() => {});

    await songService.populateDb();
    expect(spy).toHaveBeenCalled();
  });
});

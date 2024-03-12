const fs = require("fs");
const path = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { PlaylistService } = require("../services/playlist.service");
const { dbService } = require("../services/database.service");
const DB_CONSTS = require("../utils/env");

const playlists = require("../data/playlists.json").playlists;

describe("Playlist Service", () => {
  let playlistService;
  let mongoServer;
  let uri = "";
  const collectionName = DB_CONSTS.DB_COLLECTION_PLAYLISTS;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    await dbService.connectToServer(uri);
    await dbService.db.createCollection(collectionName);
    await dbService.db.collection(collectionName).insertMany([playlists[0], playlists[1]]);
    playlistService = new PlaylistService();
    playlistService.dbService = dbService;
  });

  afterEach(async () => {
    await dbService.client.close();
    await mongoServer.stop();
  });

  it("getAllPlaylists should return all playlists", async () => {
    const allPlaylists = await playlistService.getAllPlaylists();
    expect(allPlaylists.length).toEqual(2);
  });

  it("getPlaylistById should return a specific playlist by it's id", async () => {
    const playlist = await playlistService.getPlaylistById(playlists[0].id);
    expect(playlist).toEqual(playlists[0]);
  });

  it("getPlaylistById should return null if playlist not found", async () => {
    const playlist = await playlistService.getPlaylistById("abcd");
    expect(playlist).toBeNull();
  });

  it("addPlaylist should add a playlist", async () => {
    jest.spyOn(playlistService, "chooseProperEncoding").mockImplementation(() => {
      return Promise.resolve("jpeg");
    });
    jest.spyOn(playlistService, "savePlaylistThumbnail").mockImplementation(() => {
      return Promise.resolve();
    });
    const newPlaylist = {
      id: "123456789",
      name: "Test Playlist",
      description: "Updated Description",
      thumbnail: "Updated Thumbnail",
      songs: [{ id: 0 }],
    };
    await playlistService.addPlaylist(newPlaylist);
    const allPlaylists = await playlistService.getAllPlaylists();
    expect(allPlaylists).toContainEqual(newPlaylist);
  });

  it("updatePlaylist should update a playlist", async () => {
    jest.spyOn(playlistService, "chooseProperEncoding").mockImplementation(() => {
      return Promise.resolve("jpeg");
    });
    jest.spyOn(playlistService, "savePlaylistThumbnail").mockImplementation(() => {
      return Promise.resolve();
    });
    const updatedPlaylist = { ...playlists[0] };
    const newName = "Updated Playlist";
    updatedPlaylist.name = newName;
    await playlistService.updatePlaylist(updatedPlaylist);
    const modifiedPlaylist = await playlistService.getPlaylistById(updatedPlaylist.id);
    expect(modifiedPlaylist.name).toEqual(newName);
    expect(modifiedPlaylist.description).toEqual(playlists[0].description);
  });

  it("deletePlaylist should delete a playlist", async () => {
    const spy = jest.spyOn(playlistService, "deletePlaylistThumbnail").mockImplementation(() => {
      return Promise.resolve();
    });
    await playlistService.deletePlaylist(playlists[0].id);
    const allPlaylists = await playlistService.getAllPlaylists();
    expect(allPlaylists).not.toContainEqual(playlists[0]);
    expect(spy).toHaveBeenCalled();
  });

  it("deletePlaylist should not delete any playlist if id not found", async () => {
    await playlistService.deletePlaylist("123456789");
    const allPlaylists = await playlistService.getAllPlaylists();
    expect(allPlaylists.length).toEqual(2);
  });

  it("deletePlaylistThumbnail should call unlink from fs module", async () => {
    const spy = jest.spyOn(fs.promises, "unlink").mockImplementation(() => {});
    await playlistService.deletePlaylistThumbnail("testPath");
    expect(spy).toBeCalled();
  });

  it("search should return all playlists matching the search string", async () => {
    const searchString = "de";
    const exact = false;
    const searchResults = await playlistService.search(searchString, exact);
    expect(searchResults).toEqual([playlists[0], playlists[1]]);
  });

  it("search should return all playlists matching the search string with exact search", async () => {
    const searchString = "Rock";
    const exact = true;
    const searchResults = await playlistService.search(searchString, exact);
    expect(searchResults).toEqual([playlists[1]]);
  });

  it("search should return no playlists matching the search string with exact search and no hits", async () => {
    const searchString = "rock";
    const exact = true;
    const searchResults = await playlistService.search(searchString, exact);
    expect(searchResults).toEqual([]);
  });

  it("chooseProperEncoding should choose the proper encoding (jpeg)", async () => {
    const encoding = await playlistService.chooseProperEncoding("data:image/jpeg;base64,");
    expect(encoding).toEqual("jpeg");
  });

  it("chooseProperEncoding should choose the proper encoding (png)", async () => {
    const encoding = await playlistService.chooseProperEncoding("data:image/png;base64,");
    expect(encoding).toEqual("png");
  });

  it("chooseProperEncoding should choose the proper encoding (bmp)", async () => {
    const encoding = await playlistService.chooseProperEncoding("data:image/bmp;base64,");
    expect(encoding).toEqual("bmp");
  });

  it("chooseProperEncoding should choose the proper encoding (jpg)", async () => {
    const encoding = await playlistService.chooseProperEncoding("data:image/jpg;base64,");
    expect(encoding).toEqual("jpg");
  });

  it("chooseProperEncoding should return an error for non supported picture format", async () => {
    try {
      await playlistService.chooseProperEncoding("data:image/gif;base64,");
    } catch (error) {
      expect(error).toEqual(new Error("Invalid image format"));
    }
  });

  it("savePlaylistThumbnail should save the thumbnail", async () => {
    const playlist = { id: 123, thumbnail: "test.png" };
    jest.spyOn(playlistService, "chooseProperEncoding").mockImplementation(() => "png");
    const fsSpy = jest.spyOn(fs.promises, "writeFile").mockImplementation(() => {});
    const fileFormat = "png";
    const filePath = path.join(__dirname + `../../assets/img/${playlist.id}.${fileFormat}`);
    const thumbnailData = playlist.thumbnail.replace(`data:image/${fileFormat};base64,`, "");
    await playlistService.savePlaylistThumbnail(playlist);
    expect(fsSpy).toBeCalled();
    expect(fsSpy).toBeCalledWith(filePath, thumbnailData, { encoding: "base64" });
  });

  it("should call populateDb() of DatabaseService", async () => {
    const spy = jest.spyOn(playlistService.dbService, "populateDb").mockImplementation(() => {});

    await playlistService.populateDb();
    expect(spy).toHaveBeenCalled();
  });
});

const { SongService } = require("../services/songs.service");
const { PlaylistService } = require("../services/playlist.service");
const { SearchBarService } = require("../services/search_bar.service");

describe("Search Bar Service", () => {
  let searchBarService;

  beforeEach(() => {
    searchBarService = new SearchBarService(new SongService(), new PlaylistService());
  });

  it("search should call search function in SongService and PlaylistService", async () => {
    const searchSongSpy = jest.spyOn(searchBarService.songsService, "search").mockImplementation(async () => []);
    const searchPlaylistSpy = jest.spyOn(searchBarService.playlistService, "search").mockImplementation(async () => []);
    await searchBarService.search("test", false);

    expect(searchSongSpy).toHaveBeenCalled();
    expect(searchSongSpy).toHaveBeenCalledWith("test", false);
    expect(searchPlaylistSpy).toHaveBeenCalled();
    expect(searchPlaylistSpy).toHaveBeenCalledWith("test", false);
  });

  it("search should return an object containing filtered playlists and songs", async () => {
    jest.spyOn(searchBarService.songsService, "search").mockImplementation(async () => [{ id: 1 }]);
    jest.spyOn(searchBarService.playlistService, "search").mockImplementation(async () => [{ id: "abc" }]);

    const res = await searchBarService.search("test", false);
    expect(res).toEqual({ playlists: [{ id: "abc" }], songs: [{ id: 1 }] });
  });
});

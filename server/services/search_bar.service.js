class SearchBarService {
  constructor (songsService, playlistService) {
    this.songsService = songsService;
    this.playlistService = playlistService;
  }

  async search (searchParameters, exact) {
    const songs = await this.songsService.search(searchParameters, exact);
    const playlists = await this.playlistService.search(searchParameters, exact);
    return { songs, playlists };
  }
}

module.exports = { SearchBarService };

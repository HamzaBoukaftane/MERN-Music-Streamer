const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { SongService } = require("../services/songs.service");
const { PlaylistService } = require("../services/playlist.service");
const { SearchBarService } = require("../services/search_bar.service");

const songService = new SongService();
const playlistService = new PlaylistService();

const searchBarService = new SearchBarService(songService, playlistService);

/**
 * Retourne une liste de chansons et de playlists qui correspondent à la recherche
 * @memberof module:routes/search_bar
 * @name PATCH /search/
 */
router.get("/", async (request, response) => {
  try {
    const search_query = request.query.search_query;
    const exact = request.query.exact === "true"; // par défaut : tout est un string
    const search = await searchBarService.search(search_query, exact);
    response.status(HTTP_STATUS.SUCCESS).json(search);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).send(error);
  }
});

module.exports = { router, searchBarService };

const fs = require("fs");

class FileSystemManager {
  /**
   * Lit et retourne le contenu d'un fichier
   * @param {string} path : le chemin qui correspond au fichier JSON
   * @returns {Promise<Buffer>} le contenu du fichier sous la forme de Buffer
   */
  async readFile (path) {
    return await fs.promises.readFile(path);
  }
}

module.exports = { FileSystemManager };

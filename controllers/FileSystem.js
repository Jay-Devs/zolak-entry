const { createReadStream } = require('fs');
const fs = require('fs').promises;

const settings = require('@settings');

module.exports = {
  /**
   * Resolve BASE path to space
   * @param {*} space - space to which file belongs
   * @returns 
   */
  resolvePath(space) {
    return settings.paths[space]
  }
};

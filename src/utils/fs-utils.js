const fs = require('fs');

/**
 * Creates folder if it doesn't exist.
 * @param {string} folderPath - folder's path.
 * @returns {void}
 */
function createFolderIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
}

module.exports = {
    createFolderIfNotExists,
};

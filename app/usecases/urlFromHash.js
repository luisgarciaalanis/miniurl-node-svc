const miniUrlDB = require('../stores/MiniURLDB');

/**
 * gets the url for a hash.
 * @param {string} hash hash value to get the url for.
 */
const urlFromHash = async (hash) => {
    const url = await miniUrlDB.findUrl(hash);

    if (!url) {
        throw new Error('URL not found!');
    }

    return url;
};

module.exports = urlFromHash;

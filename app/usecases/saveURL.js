const miniUrlDB = require('../stores/MiniURLDB');
const hasher = require('../core/hasher');

/**
 * Saves a url and returns the associated hashid.
 *
 * @param {string} url
 */
const saveURL = async (url) => {
    // 1. if the url is already stored return the hash.
    let hash = await miniUrlDB.findUrlHash(url);

    if (hash) {
        return hash;
    }

    // 2. Otherwise store the URL and return the new hash.
    const newUrlID = await miniUrlDB.reserveUrl();
    hash = hasher.generateForID(newUrlID);
    const result = await miniUrlDB.storeUrl(newUrlID, url, hash);

    if (result) {
        return hash;
    }

    throw new Error('Unable to save URL!');
};

module.exports = saveURL;

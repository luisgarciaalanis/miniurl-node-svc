const miniURLDB = require('../stores/MiniURLDB');
const log = require('../core/log');
const { HashAlreadyTaken } = require('./errors');

/**
 * Saves a custom url and returns the associated hashid.
 *
 * @param {string} url
 * @param {string} hash
 */
const saveCustomURL = async (url, hash) => {
    const foundURL = await miniURLDB.findUrl(hash);

    // 1. Fail if the hash is already taken.
    if (foundURL) {
        const msg = `The hash "${hash}" is unavailable`;
        log.warn(`saveCustomURL: ${msg}`);
        throw new HashAlreadyTaken(msg);
    }

    // 2. Otherwise store the URL and return the new hash.
    const saved = await miniURLDB.storeCustomUrl(url, hash);

    if (saved) {
        return hash;
    }

    throw new Error('Unable to save URL!');
};

module.exports = saveCustomURL;

const miniUrlDB = require('../stores/MiniURLDB');
const log = require('../core/log');
const { HashAlreadyTaken } = require('./errors');

/**
 * Saves a custom url and returns the associated hashid.
 *
 * @param {string} url
 * @param {string} hash
 */
const saveCustomURL = async (url, hash) => {
    const foundNonCustomURL = await miniUrlDB.findUrlEx(hash, false);

    // 1. Fail if the hash is already a non custom hash.
    if (foundNonCustomURL) {
        const msg = `The hash ${hash} is unavailable`;
        log.warning(`saveCustomURL: ${msg}`);
        throw new HashAlreadyTaken(msg);
    }

    // 2. if the url is already stored return the hash.
    const foundURL = await miniUrlDB.findUrlEx(hash, true);

    if (foundURL) {
        return hash;
    }

    // 3. Otherwise store the URL and return the new hash.
    const saved = await miniUrlDB.storeCustomUrl(url, hash);

    if (saved) {
        return hash;
    }

    throw new Error('Unable to save URL!');
};

module.exports = saveCustomURL;

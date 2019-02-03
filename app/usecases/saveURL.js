const miniUrlDB = require('../stores/MiniURLDB');
const hasher = require('../core/hasher');

/**
 * Saves a url and returns the associated hashid.
 *
 * @param {string} url
 */
const saveURL = async (url) => {
    // 1. if the url is already stored return the hash.
    let hash = await miniUrlDB.findUrlHash(url, false);

    if (hash) {
        return hash;
    }

    let saved = false;

    /* eslint-disable no-await-in-loop */
    while (!saved) {
        // 2. Otherwise store the URL and return the new hash.
        const newUrlID = await miniUrlDB.reserveUrl();
        hash = hasher.generateForID(newUrlID);

        const foundCustom = await miniUrlDB.findUrlEx(hash, true);

        if (!foundCustom) {
            if (await miniUrlDB.updateURL(newUrlID, url, hash)) {
                saved = true;
            }
            break;
        }
    }
    /* eslint-enable no-await-in-loop */

    if (saved) {
        return hash;
    }

    throw new Error('Unable to save URL!');
};

module.exports = saveURL;

/**
 * Validates a hash has only letters, number and possibly dashes in between them.
 * @param {string} hash hash to validate.
 */
const isValidHash = (hash) => {
    const maxSize = 20;
    const regExp = /^[a-zA-Z0-9]+[a-zA-Z0-9-]*[a-zA-Z0-9]+$/;
    const regExp2 = /^[a-zA-Z0-9]+$/;

    if (!hash) {
        return false;
    }

    if (hash.length > maxSize) {
        return false;
    }

    return regExp.test(hash) || regExp2.test(hash);
};

module.exports = isValidHash;

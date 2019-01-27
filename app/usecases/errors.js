/**
 * Error thrown for already taken hashes.
 */
class HashAlreadyTaken extends Error {
    constructor(message) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, HashAlreadyTaken.prototype);
    }
}

module.exports.HashAlreadyTaken = HashAlreadyTaken;

const Hashids = require('hashids');

/**
 * Helps encode and decode hashes.
 */
class Hasher {
    constructor() {
        this.generateForID = this.generateForID.bind(this);
        this.decode = this.decode.bind(this);

        this.salt = 'dolor sit amet, consectetur adipiscing elit. Aliquam elementum ipsum';
        this.base32Alphabet = 'abcdefghijkmnopqrstuvwxyz2345679';
        this.hashids = new Hashids(this.salt, 5, this.base32Alphabet);
    }

    /**
     * generates a unique hash for a given integer.
     * @param {number} id
     */
    generateForID(id) {
        if (typeof id !== 'number') {
            throw new Error('Hasher: id must be a number!');
        }

        return this.hashids.encode(id);
    }

    /**
     * Decodes a hash into an integer.
     * @param {string} hash
     */
    decode(hash) {
        const numbers = this.hashids.decode(hash);

        if (numbers.length !== 1) {
            return null;
        }

        return numbers[0];
    }
}

module.exports = new Hasher();

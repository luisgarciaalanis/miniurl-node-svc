const { isValidHash } = require('./index');

/* global it, describe, expect */

describe('test isValidHash...', () => {
    it('Can\'t be undefined', () => {
        expect(isValidHash()).toBe(false);
    });

    it('Can\'t be null', () => {
        expect(isValidHash(null)).toBe(false);
    });

    it('Can\'t be empty string', () => {
        expect(isValidHash('')).toBe(false);
    });

    it('Can\'t be bigger than 20 characters', () => {
        expect(isValidHash('012345678901234567890')).toBe(false);
    });

    it('Can be bigger than 20 characters', () => {
        expect(isValidHash('01234567890123456789')).toBe(true);
    });

    describe('with hash with valid characters', () => {
        const testHashes = [
            'a',
            '1',
            '1up',
            'test-dash',
            'test-double-dash',
        ];

        testHashes.forEach((hash) => {
            it(`hash = "${hash}"`, () => {
                expect(isValidHash(hash)).toBe(true);
            });
        });
    });

    describe('with invalid hashes', () => {
        const testHashes = [
            ' ',
            '$',
            '-asd',
            '343-',
            '.',
            'a.b',
            'a b',
        ];

        testHashes.forEach((hash) => {
            it(`hash = "${hash}"`, () => {
                expect(isValidHash(hash)).toBe(false);
            });
        });
    });
});

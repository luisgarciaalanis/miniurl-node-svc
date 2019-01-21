const hasher = require('./hasher');

/* global it, describe, expect */

describe('test urlFromString...', () => {
    describe('with good ID...', () => {
        it(('generate hash for 56'), () => {
            const hash = hasher.generateForID(56);
            expect(hash).toBe('ok5zo');
        });

        it(('generate ID from ok5zo hash'), () => {
            const id = hasher.decode('ok5zo');
            expect(id).toBe(56);
        });
    });

    describe('for errors...', () => {
        it(('generate with "1"'), () => {
            expect(hasher.generateForID.bind(hasher, '1')).toThrowError('Hasher: id must be a number!');
        });

        it(('decode with "aaaaab"'), () => {
            const id = hasher.decode('aaaaab');
            expect(id).toBe(null);
        });

        it(('decode with "o2774" for multiple ids'), () => {
            const id = hasher.decode('vqrivda9e');
            expect(id).toBe(null);
        });
    });
});

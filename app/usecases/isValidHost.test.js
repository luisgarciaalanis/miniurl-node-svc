const { isValidHost } = require('./index');

/* global it, describe, expect */

describe('test isValidHost...', () => {
    it('Can\'t be undefined', () => {
        expect(isValidHost()).toBe(false);
    });

    it('Can\'t be null', () => {
        expect(isValidHost(null)).toBe(false);
    });

    it('Can\'t be empty string', () => {
        expect(isValidHost('')).toBe(false);
    });

    it('Can\'t be bigger than 253 characters', () => {
        let host = '';
        for (let x = 0; x < 5; x++) {
            host += '012345678901234567890123456789012345678901234567890123456789.';
        }
        expect(isValidHost(host)).toBe(false);
    });

    describe('with valid hosts', () => {
        const testHosts = [
            'somehost',
            'somehost.com',
            'www.google.com',
            'with.trailing.dot.',
            'da-sh',
            'da-sh.dash-2',
            'da-sh.dash-2.com-3',
            'da-sh.dash--2.com-3',
            'da-sh.dash--2.com-3.',
        ];

        testHosts.forEach((host) => {
            it(`host = "${host}"`, () => {
                expect(isValidHost(host)).toBe(true);
            });
        });
    });

    describe('with invalid hosts', () => {
        const testHosts = [
            ' ',
            'www google',
            '.',
            '.com',
            'www .com',
            '-www.com',
            'www.com-',
            'ww#om',
            'ww&&om',
            'ww&20om',
        ];

        testHosts.forEach((host) => {
            it(`host = "${host}"`, () => {
                expect(isValidHost(host)).toBe(false);
            });
        });
    });
});

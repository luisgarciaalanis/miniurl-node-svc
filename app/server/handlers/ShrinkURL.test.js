const server = require('../index');
const usecases = require('../../usecases');

/* global it, describe, expect, beforeAll, afterAll */

/**
 * Returns a long url.
 * @returns {string} string url.
 */
const longURL = (size) => {
    const urlPrefix = 'http://www.';
    const urlPostfix = '.com';
    const maxAdd = size - urlPrefix.length - urlPostfix.length;
    let middleStr = '';

    if (maxAdd < 0) throw new Error('size to short');

    for (let i = 0; i < maxAdd; i++) {
        middleStr += 'x';
    }

    return `${urlPrefix}${middleStr}${urlPostfix}`;
};

/**
 * fakeSaveURL usecase.
 *
 * @param {string} url
 */
const fakeSaveURL = async (url) => {
    const urlToHash = {
        'http://www.google.com/': 'abcd',
        'http://www.starwars.com/': 'lala',
        'http://www.sony.com/cool': 'dddd',
        'mailto:homer@simpsons.com': 'poiu',
    };

    const hash = urlToHash[url];

    if (!hash) {
        throw new Error('hash not found!');
    }

    return hash;
};

describe('test shrinkURL...', () => {
    let saveURLBackup = null;
    beforeAll(async () => {
        await server.start();
        saveURLBackup = usecases.saveURL;
        usecases.saveURL = fakeSaveURL;
    });

    afterAll(async () => {
        await server.stop();
        usecases.saveURL = saveURLBackup;
    });

    describe('for handler', () => {
        describe('shrink', () => {
            describe('Good URLS', () => {
                const tests = [
                    { url: 'http://www.google.com', status: 200, hash: 'abcd' },
                    { url: '//www.starwars.com', status: 200, hash: 'lala' },
                    { url: '//www.sony.com/cool', status: 200, hash: 'dddd' },
                    { url: 'mailto:homer@simpsons.com', status: 200, hash: 'poiu' },
                ];

                tests.forEach((test) => {
                    it(`URL: ${test.url}`, async () => {
                        const options = {
                            method: 'POST',
                            url: '/api/v1/shrink',
                            payload: {
                                url: test.url,
                            },
                        };

                        const response = await server.server.inject(options);
                        expect(response.statusCode).toBe(test.status);
                        expect(response.result).toMatchObject({ hash: test.hash });
                    });
                });
            });

            describe('Good URLS', () => {
                const tests = [
                    { url: 'http://www.goo gle.com', status: 400, error: 'Bad Request', message: 'Invalid URL' },
                    { url: '', status: 400, error: 'Bad Request', message: 'Missing URL' },
                    { url: 'javascript:', status: 403, error: 'Forbidden', message: 'javascript is not allowed!' },
                    { url: 'ftp://ftp.google.com', status: 400, error: 'Bad Request', message: 'Invalid URL' },
                    { url: longURL(2200), status: 414, error: 'Request-URI Too Large', message: 'URL should be less or equal to 2083 characters!' },
                    { url: 'http://m.garcia.tv', status: 403, error: 'Forbidden', message: 'Nice try!!! you script kiddie!' },
                    { url: 'http://www.trigger.not.found.com', status: 500, error: 'Internal Server Error', message: 'An internal server error occurred' },
                ];

                tests.forEach((test) => {
                    it(`URL: ${test.url.substr(0, 100)}`, async () => {
                        const options = {
                            method: 'POST',
                            url: '/api/v1/shrink',
                            payload: {
                                url: test.url,
                            },
                        };

                        const response = await server.server.inject(options);

                        expect(response.result.statusCode).toBe(test.status);
                        expect(response.result.error).toBe(test.error);
                        expect(response.result.message).toBe(test.message);
                    });
                });
            });
        });
    });
});

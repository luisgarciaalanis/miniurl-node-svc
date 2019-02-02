const sinon = require('sinon');
const server = require('../index');
const usecases = require('../../usecases');

/* global it, describe, expect, beforeAll, afterAll, afterEach */

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

describe('test shrinkURL...', () => {
    let saveURLStub = null;

    beforeAll(async () => {
        await server.start();
    });

    afterAll(async () => {
        await server.stop();
    });

    afterEach(() => {
        if (saveURLStub) {
            saveURLStub.restore();
            saveURLStub = null;
        }
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
                        saveURLStub = sinon.stub(usecases, 'saveURL').resolves(test.hash);
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

            describe('Bad URLS', () => {
                const tests = [
                    { url: 'http://www.goo gle.com', status: 400, error: 'Bad Request', message: 'Invalid URL' },
                    { url: '', status: 400, error: 'Bad Request', message: 'Missing URL' },
                    { url: 'javascript:', status: 403, error: 'Forbidden', message: 'javascript is not allowed!' },
                    { url: 'ftp://ftp.google.com', status: 400, error: 'Bad Request', message: 'Invalid URL' },
                    { url: longURL(2200), status: 414, error: 'Request-URI Too Large', message: 'URL should be less or equal to 2083 characters!' },
                    { url: 'http://m.garcia.tv', status: 403, error: 'Forbidden', message: 'Nice try!!! you script kiddie!' },
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

const Hapi = require('hapi');
const sinon = require('sinon');
const usecases = require('../../usecases');
const routes = require('../routes');

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
    let saveCustomURLStub = null;
    let server = null;

    beforeAll(() => {
        server = new Hapi.Server();
        server.route(routes);
    });

    afterAll(() => {
        server.close();
        server = null;
    });

    afterEach(() => {
        if (saveURLStub) {
            saveURLStub.restore();
            saveURLStub = null;
        }

        if (saveCustomURLStub) {
            saveCustomURLStub.restore();
            saveCustomURLStub = null;
        }
    });

    describe('handler with good URLS', () => {
        const tests = [
            { urlInput: 'http://www.google.com', urlStore: 'http://www.google.com/', status: 200, hash: 'secret' },
            { urlInput: '//www.starwars.com', urlStore: 'http://www.starwars.com/', status: 200, hash: 'custom-hash' },
            { urlInput: '//www.sony.com/cool', urlStore: 'http://www.sony.com/cool', status: 200, hash: 'google' },
            { urlInput: 'mailto:homer@simpsons.com', urlStore: 'mailto:homer@simpsons.com', status: 200, hash: 'super-mario-bros' },
        ];

        tests.forEach((test) => {
            it(`URL: ${test.urlInput}`, async () => {
                saveURLStub = sinon.stub(usecases, 'saveURL').resolves(test.hash);
                const options = {
                    method: 'POST',
                    url: '/api/v1/shrink',
                    payload: {
                        url: test.urlInput,
                    },
                };

                const response = await server.inject(options);
                expect(response.statusCode).toBe(test.status);
                expect(response.result).toMatchObject({ hash: test.hash });
                expect(saveURLStub.calledWith(test.urlStore)).toBe(true);
            });
        });
    });


    describe('handler with good URLS with custom alias', () => {
        const tests = [
            { urlInput: 'http://www.google.com', urlStore: 'http://www.google.com/', status: 200, hash: 'secret' },
            { urlInput: '//www.starwars.com', urlStore: 'http://www.starwars.com/', status: 200, hash: 'custom-hash' },
            { urlInput: '//www.sony.com/cool', urlStore: 'http://www.sony.com/cool', status: 200, hash: 'google' },
            { urlInput: 'mailto:homer@simpsons.com', urlStore: 'mailto:homer@simpsons.com', status: 200, hash: 'super-mario-bros' },
        ];

        tests.forEach((test) => {
            it(`URL: ${test.urlInput} Custom HASH: ${test.hash}`, async () => {
                saveCustomURLStub = sinon.stub(usecases, 'saveCustomURL').resolves(test.hash);
                const options = {
                    method: 'POST',
                    url: '/api/v1/shrink',
                    payload: {
                        url: test.urlInput,
                        hash: test.hash,
                    },
                };

                const response = await server.inject(options);
                expect(response.statusCode).toBe(test.status);
                expect(response.result).toMatchObject({ hash: test.hash });
                expect(saveCustomURLStub.calledWith(test.urlStore, test.hash)).toBe(true);
            });
        });
    });

    describe('Bad URLS', () => {
        const tests = [
            { url: 'http://www.goo gle.com', status: 400, error: 'Bad Request', message: 'Invalid URL' },
            { url: '', status: 400, error: 'Bad Request', message: 'Missing URL' },
            { url: 'a!a', status: 400, error: 'Bad Request', message: 'Invalid URL' },
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

                const response = await server.inject(options);

                expect(response.result.statusCode).toBe(test.status);
                expect(response.result.error).toBe(test.error);
                expect(response.result.message).toBe(test.message);
            });
        });
    });

    it('url with bad custom alias', async () => {
        const options = {
            method: 'POST',
            url: '/api/v1/shrink',
            payload: {
                url: 'www.golang.com',
                hash: 'bad hash',
            },
        };

        const response = await server.inject(options);
        expect(response.statusCode).toBe(400);
    });
});

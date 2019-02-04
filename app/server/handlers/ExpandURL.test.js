const Hapi = require('hapi');
const sinon = require('sinon');
const usecases = require('../../usecases');
const routes = require('../routes');

/* global it, describe, expect, beforeAll, afterAll, afterEach */

describe('test expandURL...', () => {
    let urlFromHashStub = null;
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
        if (urlFromHashStub) {
            urlFromHashStub.restore();
            urlFromHashStub = null;
        }
    });

    describe('handler with good hash', () => {
        const tests = [
            { url: 'http://www.google.com', status: 302, hash: 'abcd' },
            { url: '//www.starwars.com', status: 302, hash: '1234' },
            { url: '//www.sony.com/cool', status: 302, hash: '1b1b1' },
            { url: 'mailto:homer@simpsons.com', status: 302, hash: 'l3j4h5' },
        ];

        tests.forEach((test) => {
            it(`Hash: ${test.hash} returns URL: ${test.url}`, async () => {
                urlFromHashStub = sinon.stub(usecases, 'urlFromHash').resolves(test.url);
                const options = {
                    method: 'GET',
                    url: `/${test.hash}`,
                };

                const response = await server.inject(options);
                expect(urlFromHashStub.calledWith(test.hash)).toBe(true);
                expect(response.statusCode).toBe(test.status);
                expect(response.headers.location).toBe(test.url);
            });
        });
    });

    describe('handler with bad hash', () => {
        const tests = [
            { status: 404, hash: ' ' },
            { status: 404, hash: '##' },
            { status: 400, hash: 'a.a' },
            { status: 400, hash: '.a' },
            { status: 400, hash: 'some hash' },
            { status: 400, hash: '(some hash' },
        ];

        tests.forEach((test) => {
            it(`Hash: ${test.hash} fails`, async () => {
                const options = {
                    method: 'GET',
                    url: `/${test.hash}`,
                };

                const response = await server.inject(options);
                expect(response.statusCode).toBe(test.status);
            });
        });
    });

    it('with hash that is not found', async () => {
        const testHash = 'test123';
        const options = {
            method: 'GET',
            url: `/${testHash}`,
        };

        urlFromHashStub = sinon.stub(usecases, 'urlFromHash').rejects();

        const response = await server.inject(options);
        expect(urlFromHashStub.calledWith(testHash)).toBe(true);
        expect(response.statusCode).toBe(404);
        expect(urlFromHashStub.calledWith(testHash)).toBe(true);
    });
});

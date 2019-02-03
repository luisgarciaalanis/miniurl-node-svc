const sinon = require('sinon');
const miniURLDB = require('../stores/MiniURLDB');
const usecases = require('../usecases');

/* global it, describe, expect, afterEach */

describe('test saveCustomURL...', () => {
    let findUrlStub = null;
    let storeCustomUrlStub = null;

    afterEach(() => {
        if (findUrlStub) {
            findUrlStub.restore();
            findUrlStub = null;
        }

        if (storeCustomUrlStub) {
            storeCustomUrlStub.restore();
            storeCustomUrlStub = null;
        }
    });

    describe('succeeds to', () => {
        it('find URL hash', async () => {
            const testURL = 'http://www.google.com/';
            const testCustomHash = 'customHash';

            findUrlStub = sinon.stub(miniURLDB, 'findUrl').resolves(null);
            storeCustomUrlStub = sinon.stub(miniURLDB, 'storeCustomUrl').resolves(true);

            expect(await usecases.saveCustomURL(testURL, testCustomHash)).toEqual(testCustomHash);
            expect(findUrlStub.calledWith(testCustomHash)).toBe(true);
            expect(storeCustomUrlStub.calledWith(testURL, testCustomHash)).toBe(true);
        });

        describe('fails because', () => {
            it('custom URL already exist', async () => {
                const testURL = 'http://www.google.com/';
                const testCustomHash = 'customHash';

                findUrlStub = sinon.stub(miniURLDB, 'findUrl').resolves(testURL);
                expect(usecases.saveCustomURL(testURL, testCustomHash)).rejects.toThrow();
                expect(findUrlStub.calledWith(testCustomHash)).toBe(true);
            });

            it('custom URL fails to save', async () => {
                const testURL = 'http://www.google.com/';
                const testCustomHash = 'customHash';

                findUrlStub = sinon.stub(miniURLDB, 'findUrl').resolves(null);
                storeCustomUrlStub = sinon.stub(miniURLDB, 'storeCustomUrl').resolves(false);

                await expect(usecases.saveCustomURL(testURL, testCustomHash)).rejects.toThrow();
                expect(findUrlStub.calledWith(testCustomHash)).toBe(true);
                expect(storeCustomUrlStub.calledWith(testURL, testCustomHash)).toBe(true);
            });
        });
    });
});

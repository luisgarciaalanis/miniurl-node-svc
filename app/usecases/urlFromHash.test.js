const sinon = require('sinon');
const miniURLDB = require('../stores/MiniURLDB');
const usecases = require('../usecases');

/* global it, describe, expect, afterEach */

describe('test urlFromHash...', () => {
    let findUrlStub = null;

    afterEach(() => {
        if (findUrlStub) {
            findUrlStub.restore();
            findUrlStub = null;
        }
    });

    it('finds url', async () => {
        const testURL = 'http://www.google.com/';
        const testCustomHash = 'customHash';

        findUrlStub = sinon.stub(miniURLDB, 'findUrl').resolves(testURL);

        await expect(await usecases.urlFromHash(testCustomHash)).toEqual(testURL);
        expect(findUrlStub.calledWith(testCustomHash)).toBe(true);
    });

    it('does not find url', async () => {
        const testCustomHash = 'customHash';

        findUrlStub = sinon.stub(miniURLDB, 'findUrl').resolves(null);

        await expect(usecases.urlFromHash(testCustomHash)).rejects.toThrow();
        expect(findUrlStub.calledWith(testCustomHash)).toBe(true);
    });
});

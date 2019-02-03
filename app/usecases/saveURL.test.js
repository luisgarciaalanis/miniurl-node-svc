const sinon = require('sinon');
const miniURLDB = require('../stores/MiniURLDB');
const usecases = require('../usecases');
const hasher = require('../core/hasher');

/* global it, describe, expect, afterEach */

describe('test saveURL...', () => {
    let findUrlHashStub = null;
    let reserveUrlStub = null;
    let generateForIDStub = null;
    let updateURLStub = null;
    let findUrlExStub = null;

    afterEach(() => {
        if (findUrlHashStub) {
            findUrlHashStub.restore();
            findUrlHashStub = null;
        }

        if (reserveUrlStub) {
            reserveUrlStub.restore();
            reserveUrlStub = null;
        }

        if (generateForIDStub) {
            generateForIDStub.restore();
            generateForIDStub = null;
        }

        if (updateURLStub) {
            updateURLStub.restore();
            updateURLStub = null;
        }

        if (findUrlExStub) {
            findUrlExStub.restore();
            findUrlExStub = null;
        }
    });

    describe('succeeds to', () => {
        it('find URL hash', async () => {
            const testURL = 'http://www.bam.com/';
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves('abcdef');
            await expect(usecases.saveURL(testURL)).resolves.toEqual('abcdef');
            expect(findUrlHashStub.calledWith(testURL));
        });

        it('save a url', async () => {
            const testURL = 'http://www.yahoo.com/';
            const ID = 123;
            const testHash = 'superhash';

            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves(null);
            reserveUrlStub = sinon.stub(miniURLDB, 'reserveUrl').resolves(ID);
            generateForIDStub = sinon.stub(hasher, 'generateForID').returns(testHash);
            findUrlExStub = sinon.stub(miniURLDB, 'findUrlEx').resolves(null);
            updateURLStub = sinon.stub(miniURLDB, 'updateURL').resolves(testHash);

            await expect(usecases.saveURL(testURL)).resolves.toEqual(testHash);
            expect(findUrlHashStub.calledWith(testURL));
            expect(reserveUrlStub.called);
            expect(generateForIDStub.calledWith(ID));
            expect(generateForIDStub.calledWith(testHash, true));
            expect(updateURLStub.calledWith(ID, testURL, testHash));
        });
    });

    describe('fails to', () => {
        it('reserve URL', () => {
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves(null);
            reserveUrlStub = sinon.stub(miniURLDB, 'reserveUrl').rejects('test reject');
            generateForIDStub = sinon.stub(hasher, 'generateForID').returns('Should not be here');
            findUrlExStub = sinon.stub(miniURLDB, 'findUrlEx').resolves('Should not be here');
            updateURLStub = sinon.stub(miniURLDB, 'updateURL').resolves('Should not be here');
            return expect(usecases.saveURL('http://www.bam.com/')).rejects.toThrow();
        });

        it('store URL', () => {
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves(null);
            reserveUrlStub = sinon.stub(miniURLDB, 'reserveUrl').resolves(123);
            generateForIDStub = sinon.stub(hasher, 'generateForID').returns('superhash');
            findUrlExStub = sinon.stub(miniURLDB, 'findUrlEx').resolves(null);
            updateURLStub = sinon.stub(miniURLDB, 'updateURL').rejects('test reject');
            return expect(usecases.saveURL('http://www.bam.com/')).rejects.toThrow();
        });
    });
});

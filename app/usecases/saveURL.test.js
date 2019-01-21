const sinon = require('sinon');
const miniURLDB = require('../stores/MiniURLDB');
const usecases = require('../usecases');
const hasher = require('../core/hasher');

/* global it, describe, expect, afterEach */

describe('test saveURL...', () => {
    let findUrlHashStub = null;
    let reserveUrlStub = null;
    let generateForIDStub = null;
    let storeUrlStub = null;

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

        if (storeUrlStub) {
            storeUrlStub.restore();
            storeUrlStub = null;
        }
    });

    describe('succeeds to', () => {
        it('find URL hash', () => {
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves('abcdef');
            expect(usecases.saveURL('http://www.bam.com/')).resolves.toEqual('abcdef');
        });

        it('save a url', async () => {
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves(null);
            reserveUrlStub = sinon.stub(miniURLDB, 'reserveUrl').resolves(123);
            generateForIDStub = sinon.stub(hasher, 'generateForID').returns('superhash');
            storeUrlStub = sinon.stub(miniURLDB, 'storeUrl').resolves('superhash');
            expect(await usecases.saveURL('http://www.bam.com/')).toEqual('superhash');
        });
    });

    describe('fails to', () => {
        it('reserve URL', () => {
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves(null);
            reserveUrlStub = sinon.stub(miniURLDB, 'reserveUrl').rejects('test reject');
            generateForIDStub = sinon.stub(hasher, 'generateForID').returns('superhash');
            storeUrlStub = sinon.stub(miniURLDB, 'storeUrl').resolves('superhash');
            return expect(usecases.saveURL('http://www.bam.com/')).rejects.toThrow();
        });

        it('store URL', () => {
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves(null);
            reserveUrlStub = sinon.stub(miniURLDB, 'reserveUrl').resolves(123);
            generateForIDStub = sinon.stub(hasher, 'generateForID').returns('superhash');
            storeUrlStub = sinon.stub(miniURLDB, 'storeUrl').rejects('test reject');
            return expect(usecases.saveURL('http://www.bam.com/')).rejects.toThrow();
        });
    });
});

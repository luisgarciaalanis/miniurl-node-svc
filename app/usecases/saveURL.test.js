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
        it('find URL hash', () => {
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves('abcdef');
            expect(usecases.saveURL('http://www.bam.com/')).resolves.toEqual('abcdef');
        });

        it('save a url', async () => {
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves(null);
            reserveUrlStub = sinon.stub(miniURLDB, 'reserveUrl').resolves(123);
            generateForIDStub = sinon.stub(hasher, 'generateForID').returns('superhash');
            findUrlExStub = sinon.stub(miniURLDB, 'findUrlEx').resolves(null);
            updateURLStub = sinon.stub(miniURLDB, 'updateURL').resolves('superhash');
            expect(usecases.saveURL('http://www.bam.com/')).resolves.toEqual('superhash');
        });

        it('save a custom url', async () => {
            findUrlHashStub = sinon.stub(miniURLDB, 'findUrlHash').resolves(null);
            reserveUrlStub = sinon.stub(miniURLDB, 'reserveUrl').resolves(123);
            generateForIDStub = sinon.stub(hasher, 'generateForID').returns('superhash');
            findUrlExStub = sinon.stub(miniURLDB, 'findUrlEx').resolves(null);
            updateURLStub = sinon.stub(miniURLDB, 'updateURL').resolves('superhash');
            expect(usecases.saveURL('http://www.bam.com/')).resolves.toEqual('superhash');
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

const sinon = require('sinon');
const db = require('sequelize');
const miniURLDB = require('./index');
const appSettings = require('../../core/settings/AppSettings');
const models = require('./Models');

/* global it, describe, expect, afterEach, beforeEach, beforeAll, afterAll */

class FakeSequelize {
    constructor(dbSchema, dbUsername, dbPassword, config) {
        this.dbSchema = dbSchema;
        this.dbUsername = dbUsername;
        this.dbPassword = dbPassword;
        this.config = config;

        this.failAuth = false;

        this.authenticateCalled = false;
    }

    async authenticate() {
        if (FakeSequelize.failAuth) {
            throw new Error('fake fail auth');
        }

        this.authenticateCalled = true;
        return true;
    }
}

FakeSequelize.failAuth = false;

const valueOf = (setting) => {
    let value = '';

    switch (setting) {
        case appSettings.DB_USERNAME:
            value = 'bart';
            break;
        case appSettings.DB_PASSWORD:
            value = 'password123';
            break;
        case appSettings.DB_SCHEMA:
            value = 'dbSchema';
            break;
        default:
            value = 'not found';
    }

    return value;
};

describe('test miniURLDB...', () => {
    let dbBackup = null;
    let valueOfBackup = null;

    let modelsInitStub = null;

    beforeAll(() => {
        dbBackup = miniURLDB.db;
        valueOfBackup = appSettings.valueOf;
        appSettings.valueOf = valueOf;
    });

    afterAll(() => {
        miniURLDB.db = dbBackup;
        appSettings.valueOf = valueOfBackup;
    });

    beforeEach(() => {
        miniURLDB.db = new FakeSequelize('shema', 'username', 'password', {});
    });

    afterEach(() => {
        miniURLDB.db = null;

        if (modelsInitStub) {
            modelsInitStub.restore();
            modelsInitStub = null;
        }
    });

    describe('initialization', () => {
        let SequelizeBackup = null;

        beforeAll(() => {
            SequelizeBackup = db.Sequelize;
            db.Sequelize = FakeSequelize;
        });

        afterAll(() => {
            db.Sequelize = SequelizeBackup;
        });

        afterEach(() => {
            FakeSequelize.failAuth = false;
        });

        it('init works!', async () => {
            modelsInitStub = sinon.stub(models, 'init').resolves(true);

            await expect(await miniURLDB.init()).toBe(true);
            expect(modelsInitStub.called).toBe(true);
            expect(miniURLDB.db.authenticateCalled).toBe(true);
            expect(miniURLDB.db.dbSchema).toBe('dbSchema');
            expect(miniURLDB.db.dbUsername).toBe('bart');
            expect(miniURLDB.db.dbPassword).toBe('password123');
        });

        it('db auth fails!', async () => {
            FakeSequelize.failAuth = true;
            modelsInitStub = sinon.stub(models, 'init').resolves(true);

            expect(miniURLDB.init()).resolves.toBe(false);
            expect(modelsInitStub.called).toBe(false);
            expect(miniURLDB.db.authenticateCalled).toBe(false);
            expect(miniURLDB.db.dbSchema).toBe('dbSchema');
            expect(miniURLDB.db.dbUsername).toBe('bart');
            expect(miniURLDB.db.dbPassword).toBe('password123');
        });


        it('model initialization fails!', async () => {
            modelsInitStub = sinon.stub(models, 'init').resolves(false);

            await expect(await miniURLDB.init()).toBe(false);
            expect(modelsInitStub.called).toBe(true);
            expect(miniURLDB.db.authenticateCalled).toBe(true);
            expect(miniURLDB.db.dbSchema).toBe('dbSchema');
            expect(miniURLDB.db.dbUsername).toBe('bart');
            expect(miniURLDB.db.dbPassword).toBe('password123');
        });
    });

    describe('functionality', () => {
        let urlsBackup = null;

        beforeAll(() => {
            urlsBackup = models.urls;
            models.urls = {
                create: sinon.stub(),
                findOne: sinon.stub(),
                findUrlEx: sinon.stub(),
                update: sinon.stub(),
            };
        });

        afterAll(() => {
            models.urls = urlsBackup;
        });

        beforeEach(() => {
            models.urls.create.resetHistory();
        });

        describe('reserveUrl', () => {
            it('succeeds to reserve', async () => {
                const id = 123;

                models.urls.create.resolves({ id });
                await expect(miniURLDB.reserveUrl()).resolves.toBe(id);
            });

            it('fails to reserve', async () => {
                models.urls.create.throws();
                await expect(miniURLDB.reserveUrl()).rejects.toThrow();
            });
        });

        describe('findUrlHash', () => {
            it('succeeds to find url hash', async () => {
                const testUrl = 'http://www.yahoo.com/bla';
                const testHash = 'someHash';

                models.urls.findOne.resolves({ hash: testHash });
                await expect(miniURLDB.findUrlHash(testUrl, true)).resolves.toBe(testHash);
            });

            it('fails to find url hash', async () => {
                const testUrl = 'http://www.yahoo.com/bla';

                models.urls.findOne.resolves(null);
                await expect(miniURLDB.findUrlHash(testUrl, true)).resolves.toBe(null);
            });

            it('find url hash throws', async () => {
                const testUrl = 'http://www.yahoo.com/bla';
                models.urls.findOne.throws();
                await expect(miniURLDB.findUrlHash(testUrl, true)).rejects.toThrow();
            });
        });

        describe('findUrlEx', () => {
            it('succeeds to find url', async () => {
                const testUrl = 'http://www.yahoo.com/bla';
                const testHash = 'someHash';

                models.urls.findOne.resolves({ url: testUrl });
                await expect(miniURLDB.findUrlEx(testHash, true)).resolves.toBe(testUrl);
            });

            it('fails to find url', async () => {
                const testHash = 'someHash';

                models.urls.findOne.resolves(null);
                await expect(miniURLDB.findUrlEx(testHash, true)).resolves.toBe(null);
            });

            it('find url throws', async () => {
                const testHash = 'someHash';
                models.urls.findOne.throws();
                await expect(miniURLDB.findUrlEx(testHash, true)).rejects.toThrow();
            });
        });

        describe('findUrl', () => {
            const testUrl = 'http://www.yahoo.com/bla';
            const testHash = 'someHash';

            it('succeeds to find url', async () => {
                models.urls.findOne.resolves({ url: testUrl });
                await expect(miniURLDB.findUrl(testHash)).resolves.toBe(testUrl);
            });

            it('fails to find url', async () => {
                models.urls.findOne.resolves(null);
                await expect(miniURLDB.findUrl(testHash)).resolves.toBe(null);
            });

            it('find url throws', async () => {
                models.urls.findOne.throws();
                await expect(miniURLDB.findUrl(testHash)).rejects.toThrow();
            });
        });

        describe('updateURL', () => {
            const testUrl = 'http://www.yahoo.com/bla';
            const testHash = 'someHash';
            const testID = 123;

            it('succeeds to update url', async () => {
                models.urls.update.resolves({ id: testID });
                await expect(miniURLDB.updateURL(testID, testUrl, testHash)).resolves.toBe(true);
            });

            it('fails to update url', async () => {
                models.urls.update.resolves(null);
                await expect(miniURLDB.updateURL(testID, testUrl, testHash)).resolves.toBe(false);
            });

            it('update url throws', async () => {
                models.urls.update.throws();
                await expect(miniURLDB.updateURL(testID, testUrl, testHash)).resolves.toBe(false);
            });
        });

        describe('storeCustomUrl', () => {
            const testUrl = 'http://www.yahoo.com/bla';
            const testHash = 'someHash';
            const testID = 123;

            it('succeeds to store url', async () => {
                models.urls.create.resolves({ id: testID });
                await expect(miniURLDB.storeCustomUrl(testUrl, testHash)).resolves.toBe(true);
            });

            it('fails to store url', async () => {
                models.urls.create.resolves(null);
                await expect(miniURLDB.storeCustomUrl(testUrl, testHash)).resolves.toBe(false);
            });

            it('store url throws', async () => {
                models.urls.create.throws();
                await expect(miniURLDB.storeCustomUrl(testUrl, testHash)).resolves.toBe(false);
            });
        });
    });
});

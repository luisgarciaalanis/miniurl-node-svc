const db = require('sequelize');
const appSettings = require('../../core/settings/AppSettings');
const log = require('../../core/log');
const models = require('./Models');

class MiniURLDB {
    constructor() {
        this.reserveUrl = this.reserveUrl.bind(this);
        this.findUrlHash = this.findUrlHash.bind(this);
        this.storeUrl = this.updateURL.bind(this);
        this.findUrl = this.findUrl.bind(this);
        this.findUrlEx = this.findUrlEx.bind(this);
        this.storeCustomUrl = this.storeCustomUrl.bind(this);
    }

    /**
     * initializes the database connection.
     */
    async init() {
        const dbSchema = appSettings.valueOf(appSettings.dbSchema);
        const dbUsername = appSettings.valueOf(appSettings.dbUsername);
        const dbPassword = appSettings.valueOf(appSettings.dbPassword);
        const dbHost = appSettings.valueOf(appSettings.dbHost);

        this.db = new db.Sequelize(dbSchema, dbUsername, dbPassword, {
            host: dbHost,
            dialect: 'mysql',
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        });

        try {
            await this.db.authenticate();
        } catch (e) {
            log.error(e);
            return false;
        }

        return models.init(this.db);
    }


    /**
     * Reserves a URL in the database and returns the id.
     */
    async reserveUrl() {
        let result = null;

        try {
            result = await models.urls.create();
        } catch (e) {
            log.error('reserveUrl: Unable to reserve index for new URL hash.');
            log.error(e);
            throw e;
        }

        return result.id;
    }

    /**
     * finds a hash for a url.
     * @param {string} url
     * @param {boolean} isCustom true to custom urls, false to find non custom urls.
     * @returns {string|null} the hash if found null otherwise.
     */
    async findUrlHash(url, isCustom) {
        let foundUrl = null;

        try {
            foundUrl = await models.urls.findOne({
                where: db.Sequelize.and({ url }, { isCustom }),
            });
        } catch (e) {
            log.error('findUrlHash failed to fetchOne url');
            log.error(e);
            throw e;
        }

        if (!foundUrl) {
            return null;
        }

        return foundUrl.hash;
    }

    /**
     * finds a url for a hash or custom hash.
     * @param {string} hash
     * @param {boolean} isCustom true to find a custom hash, false to find a normal hash.
     * @returns {string|null} the url if found null otherwise.
     */
    async findUrlEx(hash, isCustom) {
        let foundUrl = null;

        try {
            foundUrl = await models.urls.findOne({
                where: db.Sequelize.and({ hash }, { isCustom }),
            });
        } catch (e) {
            log.error('findUrl: failed to fetchOne url');
            log.error(e);
            throw e;
        }

        if (!foundUrl) {
            return null;
        }

        return foundUrl.url;
    }

    /**
     * finds a url for a hash.
     * @param {string} hash
     * @returns {string|null} the url if found null otherwise.
     */
    async findUrl(hash) {
        let foundUrl = null;

        try {
            foundUrl = await models.urls.findOne({ where: { hash } });
        } catch (e) {
            log.error('findUrl: failed to fetchOne url');
            log.error(e);
            throw e;
        }

        if (!foundUrl) {
            return null;
        }

        return foundUrl.url;
    }

    /**
     * Updates a URL in the database.
     * @param {*} id id of the existing reserved URL.
     * @param {*} url url to save.
     * @param {*} hash hash associated with the url.
     *
     * @returns {boolean} true if succeeds false otherwise.
     */
    async updateURL(id, url, hash) {
        let result = null;

        try {
            result = await models.urls.update({
                url,
                hash,
                isCustom: false,
            }, {
                where: {
                    id,
                },
            });
        } catch (e) {
            log.error(`storeUrl: failed to update id: ${id} url: ${url} with hash: ${hash}`);
            log.error(e);
        }

        if (!result) {
            return false;
        }

        return true;
    }

    /**
     * Stores a custom URL in the database.
     * @param {*} url url to save.
     * @param {*} hash hash associated with the url.
     *
     * @returns {boolean} true if succeeds false otherwise.
     */
    async storeCustomUrl(url, hash) {
        let result = null;

        try {
            result = await models.urls.create({
                url,
                hash,
                isCustom: true,
            });
        } catch (e) {
            log.error(`storeCustomUrl: failed to insert custom url: ${url} with hash: ${hash}`);
        }

        if (!result) {
            return false;
        }

        return true;
    }
}

module.exports = new MiniURLDB();

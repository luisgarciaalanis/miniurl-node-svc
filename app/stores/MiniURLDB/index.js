const Sequelize = require('sequelize');
const appSettings = require('../../core/settings/AppSettings');
const log = require('../../core/log');
const models = require('./Models');

class MiniURLDB {
    constructor() {
        this.reserveUrl = this.reserveUrl.bind(this);
        this.findUrlHash = this.findUrlHash.bind(this);
        this.storeUrl = this.storeUrl.bind(this);
    }

    /**
     * initializes the database connection.
     */
    async init() {
        let connected = false;
        const dbSchema = appSettings.valueOf(appSettings.DB_SCHEMA);
        const dbUsername = appSettings.valueOf(appSettings.DB_USERNAME);
        const dbPassword = appSettings.valueOf(appSettings.DB_PASSWORD);
        const dbHost = appSettings.valueOf(appSettings.DB_HOST);

        this.db = new Sequelize(dbSchema, dbUsername, dbPassword, {
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
            connected = true;
        } catch (e) {
            log.error(e);
        }

        models.init(this.db);

        return connected;
    }


    /**
     * Reserves a URL in the database and returns the id.
     */
    async reserveUrl() {
        let newUrl = -1;
        try {
            newUrl = await models.urls.create();
        } catch (e) {
            log.error('Unable to reserve index for new URL hash');
            throw e;
        }

        return newUrl.id;
    }

    /**
     * finds a hash for a url.
     * @param {string} url
     * @returns {string|null} the hash if found null otherwise.
     */
    async findUrlHash(url) {
        const foundUrl = await models.urls.findOne({ where: { url } });

        if (!foundUrl) {
            return null;
        }

        return foundUrl.hash;
    }

    /**
     * Stores a URL in the database.
     * @param {*} id id of the existing reserved URL.
     * @param {*} url url to save.
     * @param {*} hash hash associated with the url.
     *
     * @returns {boolean} true if succeeds false otherwise.
     */
    async storeUrl(id, url, hash) {
        const result = await models.urls.update({
            url,
            hash,
        }, {
            where: {
                id,
            },
        });

        if (!result) {
            return false;
        }

        return true;
    }
}

module.exports = new MiniURLDB();

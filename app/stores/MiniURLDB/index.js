const Sequelize = require('sequelize');
const appSettings = require('../../core/settings/AppSettings');
const log = require('../../core/log');

class MiniURLDB {
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

        return connected;
    }
}

module.exports = new MiniURLDB();

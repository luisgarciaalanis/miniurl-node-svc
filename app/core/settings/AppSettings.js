
const Setting = require('./Setting');

/**
 * AppSettings is used to check for application settings sanity as well as to get settings values.
 */
class AppSettings {
    constructor() {
        // constants for the application settings.
        this.DB_USERNAME = 'DB_USERNAME';
        this.DB_PASSWORD = 'DB_PASSWORD';
        this.DB_HOST = 'DB_HOST';
        this.DB_PORT = 'DB_PORT';
        this.DB_SCHEMA = 'DB_SCHEMA';

        this.settings = [
            new Setting(this.DB_USERNAME, true, false),
            new Setting(this.DB_PASSWORD, true, true),
            new Setting(this.DB_HOST, true, false),
            new Setting(this.DB_PORT, true, false),
            new Setting(this.DB_SCHEMA, true, false),
        ];
    }

    /**
     * Checks that the application settings are present and ready to be used.
     */
    ok() {
        let result = true;
        this.settings.forEach((setting) => {
            if (!setting.valid()) {
                result = false;
            }
        });

        return result;
    }

    /**
     * Returns the value of a setting.
     *
     * @param {string} setting name of the setting.
     * @returns {string} the value of a setting or an empty string if it does not exist.
     */
    valueOf(setting) {
        return process.env[setting] || '';
    }

    /**
     * Checks if a setting exists.
     *
     * @param {*} setting name of the setting.
     * @returns {boolean} true if it exists, false otherwise.
     */
    exist(setting) {
        return !!process.env[setting];
    }
}

module.exports = new AppSettings();

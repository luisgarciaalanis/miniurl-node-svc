
const Setting = require('./Setting');

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
}

module.exports = new AppSettings();

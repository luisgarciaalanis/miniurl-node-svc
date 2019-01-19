
const Setting = require('./Setting');

class AppSettings {
    constructor() {
        this.settings = [
            new Setting('DB_USERNAME', true, false),
            new Setting('DB_PASSWORD', true, true),
            new Setting('DB_HOST', true, false),
            new Setting('DB_PORT', true, false),
        ];
    }

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

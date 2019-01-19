const log = require('../log');
const settings = require('./index');

class Setting {
    constructor(key, required, isSecret) {
        this.key = key;
        this.required = required;
        this.isSecret = isSecret;
    }

    valid() {
        const found = settings.exist(this.key);

        if (!found && this.required) {
            log.error(`Setting ${this.key} is missing.`);
            return false;
        }

        if (!found && !this.required) {
            return true;
        }

        if (this.isSecret) {
            log.info(`Setting ${this.key} found.`);
        } else {
            log.info(`Setting ${this.key}: ${settings.valueOf(this.key)}`);
        }

        return found;
    }
}

module.exports = Setting;

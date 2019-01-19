const log = require('../log');

/**
 * Setting represent a single application setting.
 */
class Setting {
    /**
     * Setting constructor.
     * @param {*} key setting name.
     * @param {*} required to set if the setting is a required setting.
     * @param {*} isSecret to set if the setting should be treated as a secret (useful when logging).
     */
    constructor(key, required, isSecret) {
        this.key = key;
        this.required = required;
        this.isSecret = isSecret;
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

    /**
     * Checks to see if the setting is valid/
     *
     * @returns {boolean} true if its valid, false otherwise.
     */
    valid() {
        const found = this.exist(this.key);

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
            log.info(`Setting ${this.key}: ${this.valueOf(this.key)}`);
        }

        return found;
    }
}

module.exports = Setting;

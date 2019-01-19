class Settings {
    valueOf(setting) {
        return process.env[setting];
    }

    exist(setting) {
        return process.env[setting];
    }
}

module.exports = new Settings();

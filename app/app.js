const server = require('./server');
const appSettings = require('./core/settings/AppSettings');
const log = require('./core/log');
const miniURLDB = require('./stores/MiniURLDB');

class App {
    static async Run() {
        // Check applications settings are ok.
        if (!appSettings.ok()) {
            log.error('Applications settings are not ok!');
            return;
        }

        // try to connect to the database.
        if (!await miniURLDB.init()) {
            log.error('Unable to connect to the database!');
            return;
        }

        server.start();
    }
}

App.Run();

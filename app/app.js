const server = require('./server');
const appSettings = require('./core/settings/AppSettings');

class App {
    static Run() {
        if (appSettings.ok()) {
            server.start();
        }
    }
}

App.Run();

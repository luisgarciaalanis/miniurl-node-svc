const server = require('./server');
const appsettings = require('./core/settings/AppSettings');

class App {
    static Run() {
        if (appsettings.ok()) {
            server.start();
        }
    }
}

App.Run();

const Hapi = require('hapi');
const log = require('../core/log');
const routes = require('./routes');

class Server {
    constructor() {
        this.server = Hapi.server({
            port: 7777,
            host: '0.0.0.0',
        });

        this.server.route(routes);

        process.on('unhandledRejection', (err) => {
            this.server.close();
            log.error(err);
        });

        process.on('SIGTERM', (err) => {
            this.server.close();
            log.error(err);
        });

        process.on('uncaughtException', (err) => {
            this.server.close();
            log.error(err);
        });

        process.on('exit', () => {
            this.server.close();
        });
    }

    /**
     * Starts the server.
     */
    async start() {
        await this.server.start();
        log.info(`Server running at: ${this.server.info.uri}`);
    }

    /**
     * Stops the server.
     */
    async stop() {
        await this.server.stop();
        log.info('Server stopping!');
    }
}

module.exports = new Server();

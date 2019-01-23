const Hapi = require('hapi');
const log = require('../core/log');
const routes = require('./routes');

class Server {
    constructor() {
        this.server = Hapi.server({
            port: 7000,
            host: '0.0.0.0',
        });

        this.server.route(routes);

        process.on('unhandledRejection', (err) => {
            log.error(err);
            process.exit(1);
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

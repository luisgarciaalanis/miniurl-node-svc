const Hapi = require('hapi');
const log = require('../core/log');
const shrinkURL = require('./handlers/ShrinkURL');

class Server {
    constructor() {
        const prefix = '/api/v1';
        const options = {
            cors: true,
        };

        this.server = Hapi.server({
            port: 7000,
            host: 'localhost',
        });

        this.routes = [
            /** api routes * */
            { method: 'POST', path: `${prefix}/shrink`, handler: shrinkURL.shrink, options },
            { method: 'GET', path: `${prefix}/{id}`, handler: () => { }, options },
        ];

        this.server.route(this.routes);

        this.onDie();
    }

    onDie() {
        process.on('unhandledRejection', (err) => {
            log.error(err);
            process.exit(1);
        });
    }

    async start() {
        await this.server.start();
        log.info(`Server running at: ${this.server.info.uri}`);
    }

    async stop() {
        await this.server.stop();
        log.info('Server stopping!');
    }
}

module.exports = new Server();

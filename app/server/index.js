const Hapi = require('hapi');
const log = require('../core/log');
const shrinkURL = require('./handlers/ShrinkURL');

class Server {
    constructor() {
        const prefix = '/api/v1';

        this.server = Hapi.server({
            port: 3000,
            host: 'localhost',
        });

        this.routes = [
            /** api routes * */
            { method: 'POST', path: `${prefix}/shrink`, handler: shrinkURL.shrink },
            { method: 'POST', path: `${prefix}/{id}`, handler: () => { } },
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
}

module.exports = new Server();

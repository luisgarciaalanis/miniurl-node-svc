
const prefix = '/api/v1';
const shrinkURL = require('./handlers/ShrinkURL');

/**
 * route config options.
 */
const options = {
    cors: true,
};

/** api routes * */
const routes = [
    { options, method: 'POST', path: `${prefix}/shrink`, handler: shrinkURL.shrink },
    { options, method: 'GET', path: `${prefix}/{id}`, handler: () => { console.log('Handler reached!'); } },
];

module.exports = routes;

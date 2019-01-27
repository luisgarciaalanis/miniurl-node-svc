
const prefix = '/api/v1';
const shrinkURL = require('./handlers/ShrinkURL');
const expandURL = require('./handlers/ExpandURL');

/**
 * route config options.
 */
const options = {
    cors: true,
};

/** api routes * */
const routes = [
    { options, method: 'POST', path: `${prefix}/shrink`, handler: shrinkURL.shrink },
    { options, method: 'GET', path: '/{id}', handler: expandURL.resolveHash },
];

module.exports = routes;

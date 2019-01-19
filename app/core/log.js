const winston = require('winston');

const logger = () => {
    const console = new winston.transports.Console();
    const log = winston.clear().add(console);
    return log;
};

module.exports = logger();

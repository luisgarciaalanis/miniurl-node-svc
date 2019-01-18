const Sequelize = require('sequelize');

module.exports = {
    development: {
        username: 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA,
        host: 'miniurldb',
        dialect: 'mysql',
        seederStorage: 'sequelize',
        operatorsAliases: Sequelize.Op,
    },
    test: {
        username: 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA,
        host: '127.0.0.1',
        dialect: 'mysql',
        logging: true,
        operatorsAliases: Sequelize.Op,
    },
    production: {
        username: 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA,
        host: '127.0.0.1',
        dialect: 'mysql',
        operatorsAliases: Sequelize.Op,
    },
};

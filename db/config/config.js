const Sequelize = require('sequelize');

module.exports = {
    development: {
        username: process.env.dbUsername,
        password: process.env.dbPassword,
        database: process.env.dbSchema,
        host: process.env.dbHost,
        dialect: 'mysql',
        seederStorage: 'sequelize',
        operatorsAliases: Sequelize.Op,
    },
    test: {
        username: process.env.dbUsername,
        password: process.env.dbPassword,
        database: process.env.dbSchema,
        host: process.env.dbHost,
        dialect: 'mysql',
        seederStorage: 'sequelize',
        operatorsAliases: Sequelize.Op,
    },
    production: {
        username: process.env.dbUsername,
        password: process.env.dbPassword,
        database: process.env.dbSchema,
        host: process.env.dbHost,
        dialect: 'mysql',
        seederStorage: 'sequelize',
        operatorsAliases: Sequelize.Op,
    },
};

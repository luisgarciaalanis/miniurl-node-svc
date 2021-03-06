module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'app/**/*.js',
    ],
    coveragePathIgnorePatterns: [
        'app/app.js',
        'app/stores/MiniURLDB/Models/Urls.js',
    ],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 81.82,
            lines: 76.42,
            statements: 76.42,
        },
    },
};

const urlFromString = require('./urlFromString');

/* global it, describe, expect */

/**
 * Tests that the url from urlFromString() contains the correct properties.
 * @param {*} testData data object containing the expected properties.
 */
const testURL = (testData) => {
    const url = urlFromString(testData.inputURL);
    expect(url).toHaveProperty('href', testData.href);
    expect(url).toHaveProperty('protocol', testData.protocol);
    expect(url).toHaveProperty('username', testData.username);
    expect(url).toHaveProperty('password', testData.password);
    expect(url).toHaveProperty('hostname', testData.hostname);
    expect(url).toHaveProperty('port', testData.port);
    expect(url).toHaveProperty('pathname', testData.pathname);
    expect(url).toHaveProperty('search', testData.search);
    expect(url).toHaveProperty('hash', testData.hash);
};

/**
 * Convenience function to create a row of url test data.
 *
 * @param {string} inputURL
 * @param {string} href
 * @param {string} protocol
 * @param {string} username
 * @param {string} password
 * @param {string} hostname
 * @param {string} port
 * @param {string} pathname
 * @param {string} search
 * @param {string} hash
 */
const urlTC = (inputURL, href, protocol, username, password, hostname, port, pathname, search, hash) => ({
    inputURL, href, protocol, username, password, hostname, port, pathname, search, hash,
});

describe('test urlFromString with...', () => {
    /**
     * Tests that the urls can be parsed and broken into their respective parts.
     * NOTE: This application does not care about the different parts of the url, however this test is just a safeguard to ensure that urlFromString
     *       is able to parse only valid URLs.
     */
    describe('basic functionality:', () => {
        const testCases = [
            urlTC('http://www.google.com', 'http://www.google.com/', 'http:', '', '', 'www.google.com', '', '/', '', ''),
            urlTC('http://www.朋友.com', 'http://www.xn--iorv16b.com/', 'http:', '', '', 'www.xn--iorv16b.com', '', '/', '', ''),
            urlTC('http://www.sony.com/gof', 'http://www.sony.com/gof', 'http:', '', '', 'www.sony.com', '', '/gof', '', ''),
            urlTC('http://www.nintendo.com/mario/bros/', 'http://www.nintendo.com/mario/bros/', 'http:', '', '', 'www.nintendo.com',
                '', '/mario/bros/', '', ''),
            urlTC('ftp://whatever.info/path', 'ftp://whatever.info/path', 'ftp:', '', '', 'whatever.info', '', '/path', '', ''),
            urlTC('https://whatever.info/path', 'https://whatever.info/path', 'https:', '', '', 'whatever.info', '', '/path', '', ''),
            urlTC('https://amy:pwd@a.info/path', 'https://amy:pwd@a.info/path', 'https:', 'amy', 'pwd', 'a.info', '', '/path', '', ''),
            urlTC('http://www.google.com?search=cats&&color=brown', 'http://www.google.com/?search=cats&&color=brown', 'http:', '', '',
                'www.google.com', '', '/', '?search=cats&&color=brown', ''),
            urlTC('http://amy:pwd@www.google.com:8080?search=cats&&color=brown#info', 'http://amy:pwd@www.google.com:8080/?search=cats&&color=brown#info',
                'http:', 'amy', 'pwd', 'www.google.com', '8080', '/', '?search=cats&&color=brown', '#info'),
        ];

        testCases.forEach((testCase) => {
            it(`URL: ${testCase.inputURL}`, () => {
                testURL(testCase);
            });
        });
    });

    /**
     * Tests that the default protocol of http:// is added in case of missing protocol for some cases.
     */
    describe('no protocol:', () => {
        const testCases = [
            urlTC('/www.google.com', 'http://www.google.com/', 'http:', '', '', 'www.google.com', '', '/', '', ''),
            urlTC('//www.google.com', 'http://www.google.com/', 'http:', '', '', 'www.google.com', '', '/', '', ''),
            urlTC('www.google.com', 'http://www.google.com/', 'http:', '', '', 'www.google.com', '', '/', '', ''),
            urlTC('hrportal', 'http://hrportal/', 'http:', '', '', 'hrportal', '', '/', '', ''),
        ];

        testCases.forEach((testCase) => {
            it(`URL: ${testCase.inputURL}`, () => {
                testURL(testCase);
            });
        });
    });

    /**
     * Tests that the urlFromString call throws with malformed urls.
     */
    describe('malformations:', () => {
        const testCases = [
            urlTC('http:// www.google.com', '', '', '', '', '', '', '', '', ''),
            urlTC('http: //www.google.com', '', '', '', '', '', '', '', '', ''),
            urlTC('http://www.goo gle.com', '', '', '', '', '', '', '', '', ''),
            urlTC('://www.google.com', '', '', '', '', '', '', '', '', ''),
            urlTC('http://www. com', '', '', '', '', '', '', '', '', ''),
            urlTC('http://', '', '', '', '', '', '', '', '', ''),
        ];

        testCases.forEach((testCase) => {
            it(`URL: ${testCase.inputURL}`, () => {
                expect(urlFromString.bind(null, testCase.inputURL)).toThrowError('Invalid URL');
            });
        });
    });
});

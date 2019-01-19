/**
 * Parses a url from a string.
 *
 * @param {string} rawURL string containing URL.
 * 
 * @returns {URL}
 */
const urlFromString = (rawURL) => {
    let urlStr = rawURL.trim();
    let url = null;

    try {
        // try to parse the URL.
        url = new URL(urlStr);
    } catch (e) {
        try {
            const patt = /[a-z]*:\/\//i;
            const matched = patt.exec(rawURL);

            if (!matched) {
                urlStr = urlStr.trimLeft('/');

                // try again adding the http protocol.
                urlStr = `http://${urlStr}`;
            }

            url = new URL(urlStr);
        } catch (e) {
            throw new Error('Invalid URL');
        }
    }

    return url;
}

module.exports = urlFromString;
/**
 * Validates a host has only letters, number and possibly dashes and single periods in between them.
 * @param {string} host hash to validate.
 */
const isValidHost = (host) => {
    /* Hostnames are composed of a series of labels concatenated with dots.
       For example, "en.wikipedia.org" is a hostname. Each label must be from 1 to 63 characters long,
       and the entire hostname (including the delimiting dots but not a trailing dot) has a maximum of
       253 ASCII characters
    */
    const maxUrlSize = 253;

    if (!host || (host.length > maxUrlSize)) {
        return false;
    }

    const maxLabelSize = 63;
    const labelExp = /^[a-zA-Z0-9]+[a-zA-Z0-9-]*[a-zA-Z0-9]+$/;
    const labelNoDashExp = /^[a-zA-Z0-9]+$/;
    let isValid = true;
    const hostParts = host.split('.');

    for (let index = 0; index < hostParts.length; index++) {
        if (hostParts[index].length > maxLabelSize) {
            isValid = false;
            break;
        }

        if ((hostParts[index].length === 0) && ((hostParts.length === 1) || (index < (hostParts.length - 1)))) {
            isValid = false;
            break;
        }

        if ((index > 0) && (index === (hostParts.length - 1)) && (hostParts[index].length === 0)) {
            break;
        }

        if (!labelExp.test(hostParts[index]) && !labelNoDashExp.test(hostParts[index])) {
            isValid = false;
            break;
        }
    }


    return isValid;
};

module.exports = isValidHost;

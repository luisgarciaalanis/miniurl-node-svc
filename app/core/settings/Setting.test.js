const Setting = require('./Setting');

/* global beforeEach, afterEach, it, describe, expect */

describe('Test Setting...', () => {
    let env = {};
    /**
     * Backup the environment variables before each test.
     */
    beforeEach(() => {
        env = { ...process.env };
    });

    /**
     * Restore the environment variables after each test.
     */
    afterEach(() => {
        process.env = { ...env };
    });

    /**
     * Test the validation of settings.
     */
    describe('Validation functionality', () => {
        it('has valid expected settings', () => {
            process.env.USERNAME = 'frodo';
            const setting = new Setting('USERNAME', true, false);
            expect(setting.valid()).toBe(true);
        });

        it('has valid unexpected settings', () => {
            const setting = new Setting('USENAME', false, false);
            expect(setting.valid()).toBe(true);
        });

        it('has valid expected required settings', () => {
            process.env.USERNAME = 'frodo';
            const setting = new Setting('USERNAME', true, true);
            expect(setting.valid()).toBe(true);
        });
    });

    /**
     * tests the existence of settings.
     */
    describe('exist functionality', () => {
        it('settings exist', () => {
            process.env.USERNAME = 'frodo';
            const setting = new Setting('USERNAME', true, false);
            expect(setting.exist('USERNAME')).toBe(true);
        });

        it('settings does not exist', () => {
            const setting = new Setting('WHATEVER_INVALID_SETTING', true, false);
            expect(setting.exist('WHATEVER_INVALID_SETTING')).toBe(false);
        });
    });

    /**
     * test the value extraction of settings.
     */
    describe('valueOf functionality', () => {
        it('settings exist', () => {
            process.env.USERNAME = 'frodo';
            const setting = new Setting('USERNAME', true, false);
            expect(setting.valueOf('USERNAME')).toBe('frodo');
        });

        it('settings does not exist', () => {
            const setting = new Setting('WHATEVER_INVALID_SETTING', true, false);
            expect(setting.valueOf('WHATEVER_INVALID_SETTING')).toBe('');
        });
    });
});

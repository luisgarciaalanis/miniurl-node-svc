const appSettings = require('./AppSettings');

/* global beforeEach, afterEach, it, describe, expect */

describe('Test appSettings...', () => {
    describe('functionality', () => {
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

        it('valid settings', () => {
            process.env.DB_USERNAME = 'frodo';
            process.env.DB_PASSWORD = 'super secret password';
            process.env.DB_HOST = 'mordor.com';
            process.env.DB_PORT = '9999';
            process.env.DB_SCHEMA = 'lodr';

            expect(appSettings.ok()).toBe(true);
        });

        it('valid missing required field', () => {
            process.env.DB_USERNAME = 'frodo';
            process.env.DB_PASSWORD = 'super secret password';
            delete process.env.DB_HOST;
            process.env.DB_PORT = '9999';
            process.env.DB_SCHEMA = 'lodr';

            expect(appSettings.ok()).toBe(false);
        });


        /**
         * tests the existence of settings.
         */
        describe('exist functionality', () => {
            it('settings exist', () => {
                process.env.DB_USERNAME = 'frodo';
                expect(appSettings.exist('DB_USERNAME')).toBe(true);
            });

            it('settings does not exist', () => {
                expect(appSettings.exist('WHATEVER_INVALID_SETTING')).toBe(false);
            });
        });

        /**
         * test the value extraction of settings.
         */
        describe('valueOf functionality', () => {
            it('settings exist', () => {
                process.env.DB_USERNAME = 'bilbo';
                expect(appSettings.valueOf('DB_USERNAME')).toBe('bilbo');
            });

            it('settings does not exist', () => {
                expect(appSettings.valueOf('WHATEVER_INVALID_SETTING')).toBe('');
            });
        });
    });
});

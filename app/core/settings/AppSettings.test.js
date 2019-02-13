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
            process.env.dbUsername = 'frodo';
            process.env.dbPassword = 'super secret password';
            process.env.dbHost = 'mordor.com';
            process.env.dbPort = '9999';
            process.env.dbSchema = 'lodr';

            expect(appSettings.ok()).toBe(true);
        });

        it('valid missing required field', () => {
            process.env.dbUsername = 'frodo';
            process.env.dbPassword = 'super secret password';
            delete process.env.dbHost;
            process.env.dbPort = '9999';
            process.env.dbSchema = 'lodr';

            expect(appSettings.ok()).toBe(false);
        });


        /**
         * tests the existence of settings.
         */
        describe('exist functionality', () => {
            it('settings exist', () => {
                process.env.dbUsername = 'frodo';
                expect(appSettings.exist('dbUsername')).toBe(true);
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
                process.env.dbUsername = 'bilbo';
                expect(appSettings.valueOf('dbUsername')).toBe('bilbo');
            });

            it('settings does not exist', () => {
                expect(appSettings.valueOf('WHATEVER_INVALID_SETTING')).toBe('');
            });
        });
    });
});

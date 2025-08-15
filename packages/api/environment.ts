/* eslint-disable jsdoc/require-returns */
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { type CipherGCMTypes, randomBytes } from 'node:crypto'

export const ENV_SCHEMA = createParser({

  /**
   * The port on which the API server will listen. This is required for the application
   * to start the server. It should be a valid port number between 1 and 65535.
   */
  PORT: [
    [assert.undefined, () => 3001],
    [
      assert.stringNumber.withMessage('PORT must be a valid port number between 1 and 65535'),
      Number.parseInt,
      assert.numberInRangeStrict.withMessage('PORT must be a valid port number between 1 and 65535')(1, 65535),
    ],
  ],

  /**
   * The host on which the API server will listen. This is required for the application
   * to start the server. It should be a valid IP address or hostname.
   */
  HOST: [
    [assert.undefined, () => '0.0.0.0'],
    [assert.stringNotEmpty],
  ],

  /**
   * The URL for the front-end application. This is used to set the `Access-Control-Allow-Origin`
   * header for CORS requests. It should be a valid URL that the front-end application is served from.
   */
  APP_URL: [
    [assert.undefined, () => 'http://localhost:3000'],
    [assert.stringNotEmpty],
  ],

  /**
   * The database connection URL for the PostgreSQL database.
   * This is required for the application to connect to the database.
   * It should be in the format: `postgres://username:password@host:port/database`
   */
  DATABASE_URL: process.env.NODE_ENV === 'production'
    ? [assert.stringNotEmpty.withMessage('DATABASE_URL is required')]
    : [() => ''],

  /**
   * Whether to synchronize the database schema on application startup.
   * This is useful for development environments but should be set to false in production.
   */
  DATABASE_SYNCRONIZE: [
    [assert.undefined, () => true],
    [assert.string, parseBoolean],
  ],

  /**
   * Use the `X-Forwarded-For` HTTP header set by proxies. If `true`, it assumes the
   * server is behind a proxy and the client IP address is set in the `X-Forwarded-For`
   * header. This makes the authentication logic use the IP address from the header
   * instead of the source IP address of the request.
   */
  USER_TRUST_PROXY: [
    [assert.undefined, () => true],
    [assert.string, parseBoolean],
  ],

  /**
   * The secret key used to sign the tokens. This key should be kept secret and should
   * not be shared with anyone. By default, the key is read from the `process.env.USER_SESSION_SECRET`
   * environment variable. If the variable is not set, a random key is generated.
   */
  USER_SECRET_KEY: [
    [assert.undefined, () => randomBytes(64).toString('hex')],
    [assert.string, assert.stringNotEmpty],
  ],

  /**
   * The algorithm used to encrypt the user session token
   * and authenticate the user. The algorithm should be
   * secure and should not be easily decrypted.
   */
  USER_CYPHER_ALGORITHM: [
    [assert.undefined, () => 'aes-256-gcm' as CipherGCMTypes],
    [assert.stringEnum.withMessage('USER_CYPHER_ALGORITHM must be one of: aes-256-gcm, aes-128-gcm, aes-192-gcm')('aes-256-gcm', 'aes-128-gcm', 'aes-192-gcm')],
  ],

  /**
   * The cookie name used to store the id of the user session
   * and authenticate the user.
   */
  USER_SESSION_ID_COOKIE_NAME: [
    [assert.undefined, () => '__Host-Session-Id'],
    [assert.string, assert.stringNotEmpty],
  ],

  /**
   * The cookie name used to store the user session token
   * and authenticate the user.
   */
  USER_SESSION_TOKEN_COOKIE_NAME: [
    [assert.undefined, () => '__Host-Session-Token'],
    [assert.string, assert.stringNotEmpty],
  ],

  /**
   * The time in milliseconds that the user session token
   * will expire. It should be a reasonable time for the
   * user to stay logged in but not too long to be a
   * security risk.
   */
  USER_SESSION_DURATION: [
    [assert.undefined, () => 1000 * 60 * 60 * 24], // 24 hours
    [assert.number, assert.numberPositive],
  ],

  /**
   * Time in milliseconds that the user recovery token will expire. It should be a
   * reasonable time for the user to reset their password but not too long to be a
   * security risk.
   */
  USER_RECOVERY_DURATION: [
    [assert.undefined, () => 1000 * 60 * 30], // 30 minutes
    [assert.number, assert.numberPositive],
  ],

  /**
   * The master secret used to encrypt and decrypt the configuration of additional
   * vault adapters. This allows secure storage of the vault configuration in the
   * database without exposing the credentials.
   */
  VAULT_CONFIGURATION_SECRET_KEY: process.env.NODE_ENV === 'production'
    ? [assert.stringNotEmpty.withMessage('VAULT_CONFIGURATION_SECRET_KEY is required')]
    : [() => 'SECRET'],

  /**
   * The algorithm used to encrypt and decrypt the configuration of additional vault
   * adapters. It must be one of the following values: `aes-256-gcm`, `aes-128-gcm`,
   * or `aes-192-gcm` to ensure we use authenticated encryption and verify the integrity
   * of the encrypted data.
   */
  VAULT_CONFIGURATION_ALGORITHM: [
    [assert.undefined, () => 'aes-256-gcm' as CipherGCMTypes],
    [assert.stringEnum.withMessage('VAULT_CONFIGURATION_ALGORITHM must be one of: aes-256-gcm, aes-128-gcm, aes-192-gcm')('aes-256-gcm', 'aes-128-gcm', 'aes-192-gcm')],
  ],

  /**
   * The default key used to encrypt and decrypt local secrets. It will be used as
   * the default cypher key for all variables that use the `local` vault adapter
   * and don't have a specific key set.
   */
  VAULT_DEFAULT_LOCAL_SECRET_KEY: process.env.NODE_ENV === 'production'
    ? [assert.stringNotEmpty.withMessage('VAULT_DEFAULT_LOCAL_SECRET_KEY is required')]
    : [() => 'SECRET'],

  /**
   * The URL to an NPM CDN that hosts the `@iconify/json` package. This package
   * is used to import the icon collections from the Iconify API.
   */
  ICON_CDN_URL: [
    [assert.undefined, () => 'https://esm.sh/'],
    [assert.string, assert.stringNotEmpty],
  ],

  /**
   * The URL of the Iconify API used to gather information about the icons and
   * their collections. It is used to fetch the icons from the remote source.
   */
  ICON_ICONIFY_URL: [
    [assert.undefined, () => 'https://api.iconify.design/'],
    [assert.string, assert.stringNotEmpty],
  ],
})

export const environment = ENV_SCHEMA(process.env)

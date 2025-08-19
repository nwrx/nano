/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
import type { CipherGCMTypes } from 'node:crypto'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'

export const ENV_DATABASE_SCHEMA = createParser({

  /**
   * The database host for the PostgreSQL database.
   * This is required for the application to connect to the database.
   */
  DATABASE_HOST: [assert.stringNotEmpty.withMessage('DATABASE_HOST is required')],

  /**
   * The database port for the PostgreSQL database.
   * This is required for the application to connect to the database.
   */
  DATABASE_PORT: [
    [assert.undefined, () => 5432],
    [
      assert.stringNumber.withMessage('DATABASE_PORT must be a valid port number between 1 and 65535'),
      Number.parseInt,
      assert.numberInRangeStrict.withMessage('DATABASE_PORT must be a valid port number between 1 and 65535')(1, 65535),
    ],
  ],

  /**
   * The database username for the PostgreSQL database.
   * This is required for the application to connect to the database.
   */
  DATABASE_USERNAME: [assert.stringNotEmpty.withMessage('DATABASE_USERNAME is required')],

  /**
   * The database password for the PostgreSQL database.
   * This is required for the application to connect to the database.
   */
  DATABASE_PASSWORD: [assert.stringNotEmpty.withMessage('DATABASE_PASSWORD is required')],

  /**
   * The database name for the PostgreSQL database.
   * This is required for the application to connect to the database.
   */
  DATABASE_NAME: [assert.stringNotEmpty.withMessage('DATABASE_NAME is required')],

  /**
   * Whether to synchronize the database schema with the application entities.
   * This is useful for development but should be disabled in production.
   */
  DATABASE_SYNCRONIZE: [
    [assert.undefined, () => false],
    [assert.string, parseBoolean],
  ],
})

export const ENV_APP_SCHEMA = createParser({

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
})

export const ENV_CONFIG_SCHEMA = createParser({

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
  USER_SECRET_KEY: process.env.NODE_ENV === 'production'
    ? [assert.stringNotEmpty.withMessage('USER_SECRET_KEY is required')]
    : [assert.undefined, () => 'user-secret-key'],

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
    [assert.stringNumber, Number.parseInt, assert.numberPositive],
  ],

  /**
   * Time in milliseconds that the user recovery token will expire. It should be a
   * reasonable time for the user to reset their password but not too long to be a
   * security risk.
   */
  USER_RECOVERY_DURATION: [
    [assert.undefined, () => 1000 * 60 * 30], // 30 minutes
    [assert.stringNumber, Number.parseInt, assert.numberPositive],
  ],

  /**
   * The master secret used to encrypt and decrypt the configuration of additional
   * vault adapters. This allows secure storage of the vault configuration in the
   * database without exposing the credentials.
   */
  VAULT_CONFIGURATION_SECRET_KEY: process.env.NODE_ENV === 'production'
    ? [assert.stringNotEmpty.withMessage('VAULT_CONFIGURATION_SECRET_KEY is required')]
    : [assert.undefined, () => 'vault-configuration-secret-key'],

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
    : [assert.undefined, () => 'vault-local-secret-key'],

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

  /**
   * The initial runners to register in the database. This is used to
   * automatically register runners that are part of the system. It should be
   * a list of URLs in the format `http://<token>@<address>:<port>`.
   * The token is used to authenticate the runner with the API server.
   */
  INITIAL_RUNNERS: process.env.NODE_ENV === 'production'
    ? [
      [assert.undefined, () => []],
      [assert.string, (value: string) => value.split(',').map(url => url.trim())],
    ]
    : [assert.undefined, () => ['http://runner-token@localhost:3002']],

  /**
   * The storage path to use for the storage module. This is used to
   * automatically create storage pools for the storage module.
   */
  STORAGE_PATH: [
    [assert.undefined, () => '.data/storage'],
    [assert.stringNotEmpty],
  ],
})

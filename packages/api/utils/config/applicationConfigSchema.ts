/* eslint-disable jsdoc/no-defaults */
/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
import type { StoragePoolConfiguration } from '../../storage/utils'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { assertStoragePoolType } from '../../storage/utils'
import { assertEncryptionAlgorithm } from './assertEncryptionAlgorithm'
import { assertEncryptionSecret } from './assertEncryptionSecret'
import { assertStringDuration } from './assertStringDuration'

export const APPLICATION_CONFIG_SCHEMA = createParser({

  /**
   * The port on which the API server will listen. This is required for the application
   * to start the server. It should be a valid port number between 1 and 65535.
   *
   * @default 8080
   */
  PORT: [
    [assert.undefined, () => 8080],
    [
      assert.stringNumber.withMessage('PORT must be a valid port number between 1 and 65535'),
      Number.parseInt,
      assert.numberInRangeStrict.withMessage('PORT must be a valid port number between 1 and 65535')(1, 65535),
    ],
  ],

  /**
   * The host on which the API server will listen. This is required for the application
   * to start the server. It should be a valid IP address or hostname.
   *
   * @default 0.0.0.0
   */
  HOST: [
    [assert.undefined, () => '0.0.0.0'],
    [assert.stringIPv4.withName('E_HOST_NOT_IPV4_OR_IPV6').withMessage('Must be a valid IPv4 or IPv6 address')],
    [assert.stringIPv6.withName('E_HOST_NOT_IPV4_OR_IPV6').withMessage('Must be a valid IPv4 or IPv6 address')],
  ],

  /**
   * The URL for the front-end application. This is used to set the `Access-Control-Allow-Origin`
   * header for CORS requests. It should be a valid URL that the front-end application is served from.
   *
   * @default http://localhost:3000
   */
  APP_URL: [
    [assert.undefined, () => 'http://localhost:3000'],
    [assert.stringUrlProtocol.withMessage('Must be a valid URL starting with http:// or https://')('http', 'https')],
  ],

  /**
   * Use the `X-Forwarded-For` HTTP header set by proxies. If `true`, it assumes the
   * server is behind a proxy and the client IP address is set in the `X-Forwarded-For`
   * header. This makes the authentication logic use the IP address from the header
   * instead of the source IP address of the request.
   *
   * @default false
   */
  USER_TRUST_PROXY: [
    [assert.undefined, () => false],
    [assert.string, parseBoolean],
  ],

  /**
   * The secret key used to encrypt the tokens. This key should be kept secret and should
   * not be shared with anyone. By default, the key is read from the `process.env.USER_SESSION_SECRET`
   * environment variable. If the variable is not set, a random key is generated.
   */
  USER_SECRET_KEY: assertEncryptionSecret,

  // /**
  //  * The algorithm used to encrypt the user session token
  //  * and authenticate the user. The algorithm should be
  //  * secure and should not be easily decrypted.
  //  */
  USER_CYPHER_ALGORITHM: assertEncryptionAlgorithm,

  /**
   * The cookie name used to store the id of the user session
   * and authenticate the user.
   */
  USER_SESSION_ID_COOKIE_NAME: [
    [assert.undefined, () => '__Host-Session-Id'],
    [assert.notUndefined, assert.stringNotEmpty],
  ],

  /**
   * The cookie name used to store the user session token
   * and authenticate the user.
   */
  USER_SESSION_TOKEN_COOKIE_NAME: [
    [assert.undefined, () => '__Host-Session-Token'],
    [assert.notUndefined, assert.stringNotEmpty],
  ],

  /**
   * The time in milliseconds that the user session token
   * will expire. It should be a reasonable time for the
   * user to stay logged in but not too long to be a
   * security risk.
   */
  USER_SESSION_DURATION: assertStringDuration(1000 * 60 * 60 * 24 /* 24 hours */),

  /**
   * Time in milliseconds that the user recovery token will expire. It should be a
   * reasonable time for the user to reset their password but not too long to be a
   * security risk.
   */
  USER_RECOVERY_TOKEN_DURATION: assertStringDuration(1000 * 60 * 30 /* 30 minutes */),

  /**
   * The master secret used to encrypt and decrypt the configuration of additional
   * vault adapters. This allows secure storage of the vault configuration in the
   * database without exposing the credentials.
   */
  VAULT_CONFIGURATION_SECRET_KEY: assertEncryptionSecret,

  /**
   * The algorithm used to encrypt and decrypt the configuration of additional vault
   * adapters. It must be one of the following values: `aes-256-gcm`, `aes-128-gcm`,
   * or `aes-192-gcm` to ensure we use authenticated encryption and verify the integrity
   * of the encrypted data.
   */
  VAULT_CONFIGURATION_ALGORITHM: assertEncryptionAlgorithm,

  /**
   * The URL to an NPM CDN that hosts the `@iconify/json` package. This package
   * is used to import the icon collections from the Iconify API.
   */
  ICON_CDN_URL: [
    [assert.undefined, () => 'https://esm.sh/'],
    [
      assert.stringUrl.withMessage('The icon CDN URL must be a valid URL.'),
      assert.stringUrlProtocol.withMessage('The icon CDN URL must use the HTTPS or HTTP protocol.')('https', 'http'),
    ],
  ],

  /**
   * The URL of the Iconify API used to gather information about the icons and
   * their collections. It is used to fetch the icons from the remote source.
   */
  ICON_ICONIFY_URL: [
    [assert.undefined, () => 'https://api.iconify.design/'],
    [
      assert.stringUrl.withMessage('The icon CDN URL must be a valid URL.'),
      assert.stringUrlProtocol.withMessage('The icon CDN URL must use the HTTPS or HTTP protocol.')('https', 'http'),
    ],
  ],

  /**
   * The initial runners to register in the database. This is used to
   * automatically register runners that are part of the system. It should be
   * a list of URLs in the format `http://<token>@<address>:<port>`.
   * The token is used to authenticate the runner with the API server.
   */
  INITIAL_RUNNERS: [
    [assert.undefined, () => []],
    [assert.string, (value: string) => value.split(',').map(url => url.trim())],
  ],

  /**
   * The secret used to encrypt the storage pool configuration in
   * the database. This is used to protect sensitive information
   * such as access keys and secret keys.
   */
  STORAGE_POOL_ENCRYPTION_SECRET: assertEncryptionSecret,

  /**
   * The algorithm used to encrypt the storage pool configuration.
   * This should match the algorithm used to encrypt the storage pool
   * configuration in the database.
   */
  STORAGE_POOL_ENCRYPTION_ALGORITHM: assertEncryptionAlgorithm,

  /**
   * The type of the default storage pool. This is used to determine what adapter to use
   * when uploading, downloading, or erasing files.
   */
  STORAGE_PUBLIC_POOL_TYPE: assertStoragePoolType,

  /**
   * The configuration of the default storage pool. This is used to determine the
   * default storage pool to use when uploading, downloading, or erasing files.
   * It should be a valid storage pool configuration object.
   */
  STORAGE_PUBLIC_POOL_CONFIGURATION: [
    assert.stringNotEmpty,
    (value: string) => value.replaceAll(String.raw`\"`, '"'), // Unescape quotes to handle some edge cases
    assert.stringJson.withMessage('The storage public pool configuration must be a valid JSON string.'),
    JSON.parse as (value: string) => StoragePoolConfiguration,
  ],
})

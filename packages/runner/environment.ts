/* eslint-disable jsdoc/require-returns */
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'

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
})

export const ENV_CONFIG_SCHEMA = createParser({

  /**
   * The runner name. This is used to identify the runner in logs and metrics.
   * It should be a unique identifier for the runner.
   */
  RUNNER_NAME: [
    [assert.stringNotEmpty.withMessage('RUNNER_NAME is required')],
  ],

  /**
   * The runner token. This is used to authenticate the runner with the API server.
   * It should be a UUID string.
   */
  RUNNER_TOKEN: [
    [assert.stringNotEmpty.withMessage('RUNNER_TOKEN must be a valid UUID')],
  ],

  /**
   * Whether the runner should trust the proxy headers. This is useful when the runner is behind a reverse proxy.
   * Defaults to false.
   */
  RUNNER_TRUST_PROXY: [
    [assert.undefined, () => false],
    [assert.string, parseBoolean],
  ],
})

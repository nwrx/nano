/* eslint-disable jsdoc/require-returns */
import { assert, createParser } from '@unshared/validation'

export const ENV_APP_SCHEMA = createParser({

  /**
   * The port on which the API server will listen. This is required for the application
   * to start the server. It should be a valid port number between 1 and 65535.
   */
  PORT: [
    [assert.undefined, () => 3002],
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
  RUNNER_NAME: process.env.NODE_ENV === 'production'
    ? [assert.stringNotEmpty.withMessage('RUNNER_NAME is required')]
    : [assert.undefined, () => 'nano-runner-dev-0'],

  /**
   * The runner token. This is used to authenticate the runner with the API server.
   * It should be a UUID string.
   */
  RUNNER_TOKEN: process.env.NODE_ENV === 'production'
    ? [assert.stringNotEmpty.withMessage('RUNNER_TOKEN is required')]
    : [assert.undefined, () => 'runner-token'],
})

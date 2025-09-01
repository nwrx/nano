import { once } from '@unshared/functions'
import { APPLICATION_CONFIG_SCHEMA } from './applicationConfigSchema'
import { handleAssertionError } from './handleAssertionError'

/** The application configuration. */
export type ApplicationConfig = ReturnType<typeof APPLICATION_CONFIG_SCHEMA>

/**
 * Parses and validates the given environment variables using the given schema.
 *
 * @param environment The environment variables to parse. Defaults to `process.env`.
 * @returns The parsed and validated environment variables.
 * @throws If the environment variables are invalid.
 *
 * @example
 * // Define a schema for the environment variables.
 * const ENV_SCHEMA = createParser({
 *   PORT: assert.stringNotEmpty.withName('E_MISSING_PORT').withMessage('The PORT environment variable is required.'),
 *   HOST: assert.stringNotEmpty.withName('E_MISSING_HOST').withMessage('The HOST environment variable is required.'),
 * })
 *
 * // Parse and validate the environment variables.
 * const { PORT, HOST } = parseEnvironment(ENV_SCHEMA)
 */
export const getConfigFromEnvironment = once((environment: NodeJS.ProcessEnv = process.env): ApplicationConfig => {
  try {
    return APPLICATION_CONFIG_SCHEMA(environment)
  }
  catch (error) {
    handleAssertionError(error)
  }
  throw new Error('unreachable')
})

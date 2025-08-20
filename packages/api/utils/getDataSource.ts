import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser, createRuleSet } from '@unshared/validation'
import { DataSource } from 'typeorm'

const assertDatabaseSynchronize = createRuleSet(
  [assert.undefined, () => process.env.NODE_ENV !== 'production'],
  [assert.string, parseBoolean],
)

function assertDatabasePort(defaultPort: number) {
  return [
    [assert.undefined, () => defaultPort],
    [
      assert.stringNumber.withMessage('DATABASE_PORT must be a valid port number between 1 and 65535'),
      Number.parseInt,
      assert.numberInRangeStrict.withMessage('DATABASE_PORT must be a valid port number between 1 and 65535')(1, 65535),
    ],
  ]
}

const ENV_DATABASE_POSTGRES_SCHEMA = createParser({
  DATABASE_TYPE: assert.stringEquals('postgres'),
  DATABASE_HOST: assert.stringNotEmpty.withMessage('DATABASE_HOST is required'),
  DATABASE_PORT: assertDatabasePort(5432),
  DATABASE_USERNAME: assert.stringNotEmpty.withMessage('DATABASE_USERNAME is required'),
  DATABASE_PASSWORD: assert.stringNotEmpty.withMessage('DATABASE_PASSWORD is required'),
  DATABASE_NAME: assert.stringNotEmpty.withMessage('DATABASE_NAME is required'),
  DATABASE_SYNCRONIZE: assertDatabaseSynchronize,
})

const ENV_DATABASE_POSTGRES_URL_SCHEMA = createParser({
  DATABASE_TYPE: assert.stringEquals('postgres'),
  DATABASE_URL: assert.stringNotEmpty.withMessage('DATABASE_URL is required'),
  DATABASE_SYNCRONIZE: assertDatabaseSynchronize,
})

const ENV_DATABASE_SQLITE_SCHEMA = createParser({
  DATABASE_TYPE: [
    [assert.undefined, () => 'sqlite'],
    [assert.stringEquals('sqlite')],
  ],
  DATABASE_PATH: [
    [assert.undefined, () => '.data/database.sqlite'],
    [assert.stringNotEmpty.withMessage('DATABASE_PATH is required')],
  ],
  DATABASE_SYNCRONIZE: assertDatabaseSynchronize,
})

export const ENV_DATABASE_SCHEMA = createRuleSet(
  [ENV_DATABASE_POSTGRES_SCHEMA],
  [ENV_DATABASE_POSTGRES_URL_SCHEMA],
  [ENV_DATABASE_SQLITE_SCHEMA],
)

export function getDataSource(environment = process.env): DataSource {
  const config = ENV_DATABASE_SCHEMA(environment)

  // --- Postgres with URL connection string.
  if (config.DATABASE_TYPE === 'postgres'
    && 'DATABASE_URL' in config
    && typeof config.DATABASE_URL === 'string') {
    return new DataSource({
      type: 'postgres',
      url: config.DATABASE_URL,
      synchronize: config.DATABASE_SYNCRONIZE,
    })
  }

  // --- Postgres with individual parameters.
  else if (config.DATABASE_TYPE === 'postgres'
    && 'DATABASE_HOST' in config
    && typeof config.DATABASE_HOST === 'string') {
    return new DataSource({
      type: 'postgres',
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      username: config.DATABASE_USERNAME,
      password: config.DATABASE_PASSWORD,
      database: config.DATABASE_NAME,
      synchronize: config.DATABASE_SYNCRONIZE,
    })
  }

  // --- SQLite with file path.
  else if (config.DATABASE_TYPE === 'sqlite') {
    return new DataSource({
      type: 'sqlite',
      database: config.DATABASE_PATH,
      synchronize: config.DATABASE_SYNCRONIZE,
    })
  }

  // --- If no valid configuration is found, throw an error.
  throw new Error('unreachable')
}

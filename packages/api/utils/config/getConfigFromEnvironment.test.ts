/* eslint-disable sonarjs/publicly-writable-directories */
import { randomBytes } from 'node:crypto'
import { getConfigFromEnvironment } from './getConfigFromEnvironment'

describe('getConfigFromEnvironment', () => {
  const validEnvironment = {
    USER_TRUST_PROXY: 'yes',
    USER_SECRET_KEY: randomBytes(32).toString('hex'),
    USER_CYPHER_ALGORITHM: 'aes-256-gcm',
    USER_SESSION_ID_COOKIE_NAME: '__Host-Session-Id',
    USER_SESSION_TOKEN_COOKIE_NAME: '__Host-Session-Token',
    USER_SESSION_DURATION: '3600000',
    USER_RECOVERY_TOKEN_DURATION: '1800000',
    VAULT_CONFIGURATION_SECRET_KEY: randomBytes(32).toString('hex'),
    VAULT_CONFIGURATION_ALGORITHM: 'aes-256-gcm',
    ICON_CDN_URL: 'https://esm.sh/',
    ICON_ICONIFY_URL: 'https://api.iconify.design',
    STORAGE_POOL_ENCRYPTION_SECRET: randomBytes(32).toString('hex'),
    STORAGE_POOL_ENCRYPTION_ALGORITHM: 'aes-256-gcm',
    STORAGE_PUBLIC_POOL_TYPE: 'local',
    STORAGE_PUBLIC_POOL_CONFIGURATION: JSON.stringify({ path: '/tmp/storage' }),
  }

  describe('USER_SECRET_KEY', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.USER_SECRET_KEY).toBe(validEnvironment.USER_SECRET_KEY)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SECRET_KEY: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SECRET_KEY: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw value is too short', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SECRET_KEY: 'short' })
      expect(shouldThrow).toThrowError('E_STRING_LENGTH_NOT_GREATER_THAN')
    })

    it('should throw if value is too long', () => {
      const longKey = 'a'.repeat(129)
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SECRET_KEY: longKey })
      expect(shouldThrow).toThrowError('E_STRING_LENGTH_NOT_LOWER_THAN')
    })
  })

  describe('USER_TRUST_PROXY', () => {
    it.each(['true', 'TRUE', 'yes', '1'])('should parse to true when value is %s', (value) => {
      const config = getConfigFromEnvironment( { ...validEnvironment, USER_TRUST_PROXY: value })
      expect(config.USER_TRUST_PROXY).toBe(true)
    })

    it('should default to false', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, USER_TRUST_PROXY: undefined })
      expect(config.USER_TRUST_PROXY).toBe(false)
    })

    it('should consider any value other than "true" as false', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, USER_TRUST_PROXY: 'anything-else' })
      expect(config.USER_TRUST_PROXY).toBe(false)
    })
  })

  describe('USER_CYPHER_ALGORITHM', () => {
    it.each(['aes-256-gcm', 'aes-192-gcm', 'aes-128-gcm'])('should parse when value is %s', (algorithm) => {
      const config = getConfigFromEnvironment( { ...validEnvironment, USER_CYPHER_ALGORITHM: algorithm })
      expect(config.USER_CYPHER_ALGORITHM).toBe(algorithm)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_CYPHER_ALGORITHM: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_CYPHER_ALGORITHM: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw if is not in the list of supported algorithms', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_CYPHER_ALGORITHM: 'invalid' })
      expect(shouldThrow).toThrowError('E_STRING_NOT_ONE_OF_VALUES')
    })
  })

  describe('USER_SESSION_ID_COOKIE_NAME', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.USER_SESSION_ID_COOKIE_NAME).toBe(validEnvironment.USER_SESSION_ID_COOKIE_NAME)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SESSION_ID_COOKIE_NAME: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SESSION_ID_COOKIE_NAME: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })
  })

  describe('USER_SESSION_TOKEN_COOKIE_NAME', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.USER_SESSION_TOKEN_COOKIE_NAME).toBe(validEnvironment.USER_SESSION_TOKEN_COOKIE_NAME)
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SESSION_TOKEN_COOKIE_NAME: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })
  })

  describe('USER_SESSION_DURATION', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.USER_SESSION_DURATION).toBe(+validEnvironment.USER_SESSION_DURATION)
    })

    it('should default to 24 hours if value is missing', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, USER_SESSION_DURATION: undefined })
      expect(config.USER_SESSION_DURATION).toBe(1000 * 60 * 60 * 24)
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SESSION_DURATION: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw if value is not a positive number', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SESSION_DURATION: '-1' })
      expect(shouldThrow).toThrowError('E_NUMBER_NOT_POSITIVE')
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_SESSION_DURATION: 'invalid' })
      expect(shouldThrow).toThrowError('E_NOT_STRING_NUMBER')
    })
  })

  describe('USER_RECOVERY_TOKEN_DURATION', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.USER_RECOVERY_TOKEN_DURATION).toBe(+validEnvironment.USER_RECOVERY_TOKEN_DURATION)
    })

    it('should default to 30 minutes if value is missing', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, USER_RECOVERY_TOKEN_DURATION: undefined })
      expect(config.USER_RECOVERY_TOKEN_DURATION).toBe(1000 * 60 * 30)
    })

    it('should throw if value is not a positive number', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_RECOVERY_TOKEN_DURATION: '-1' })
      expect(shouldThrow).toThrowError('E_NUMBER_NOT_POSITIVE')
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, USER_RECOVERY_TOKEN_DURATION: 'invalid' })
      expect(shouldThrow).toThrowError('E_NOT_STRING_NUMBER')
    })
  })

  describe('VAULT_CONFIGURATION_SECRET_KEY', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.VAULT_CONFIGURATION_SECRET_KEY).toBe(validEnvironment.VAULT_CONFIGURATION_SECRET_KEY)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, VAULT_CONFIGURATION_SECRET_KEY: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, VAULT_CONFIGURATION_SECRET_KEY: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw value is too short', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, VAULT_CONFIGURATION_SECRET_KEY: 'short' })
      expect(shouldThrow).toThrowError('E_STRING_LENGTH_NOT_GREATER_THAN')
    })

    it('should throw if VAULT_CONFIGURATION_SECRET_KEY is too long', () => {
      const longKey = 'a'.repeat(129)
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, VAULT_CONFIGURATION_SECRET_KEY: longKey })
      expect(shouldThrow).toThrowError('E_STRING_LENGTH_NOT_LOWER_THAN')
    })
  })

  describe('VAULT_CONFIGURATION_ALGORITHM', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.VAULT_CONFIGURATION_ALGORITHM).toBe(validEnvironment.VAULT_CONFIGURATION_ALGORITHM)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, VAULT_CONFIGURATION_ALGORITHM: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, VAULT_CONFIGURATION_ALGORITHM: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw if is not in the list of supported algorithms', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, VAULT_CONFIGURATION_ALGORITHM: 'invalid' })
      expect(shouldThrow).toThrowError('E_STRING_NOT_ONE_OF_VALUES')
    })
  })

  describe('ICON_CDN_URL', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.ICON_CDN_URL).toBe(validEnvironment.ICON_CDN_URL)
    })

    it('should default to https://esm.sh/ if value is missing', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, ICON_CDN_URL: undefined })
      expect(config.ICON_CDN_URL).toBe('https://esm.sh/')
    })

    it('should throw if value is not a valid URL', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, ICON_CDN_URL: 'invalid' })
      expect(shouldThrow).toThrowError('E_STRING_NOT_URL')
    })

    it('should throw if value does not use the HTTPS or HTTP protocol', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, ICON_CDN_URL: 'ftp://example.com' })
      expect(shouldThrow).toThrowError('E_STRING_URL_INVALID_PROTOCOL')
    })
  })

  describe('ICON_ICONIFY_URL', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.ICON_ICONIFY_URL).toBe(validEnvironment.ICON_ICONIFY_URL)
    })

    it('should default to https://api.iconify.design/ if value is missing', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, ICON_ICONIFY_URL: undefined })
      expect(config.ICON_ICONIFY_URL).toBe('https://api.iconify.design/')
    })

    it('should throw if value is not a valid URL', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, ICON_ICONIFY_URL: 'invalid' })
      expect(shouldThrow).toThrowError('E_STRING_NOT_URL')
    })

    it('should throw if value does not use the HTTPS or HTTP protocol', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, ICON_ICONIFY_URL: 'ftp://example.com' })
      expect(shouldThrow).toThrowError('E_STRING_URL_INVALID_PROTOCOL')
    })
  })
})

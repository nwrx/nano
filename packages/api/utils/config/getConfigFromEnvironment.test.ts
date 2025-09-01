/* eslint-disable sonarjs/publicly-writable-directories */
import { randomBytes } from 'node:crypto'
import { getConfigFromEnvironment } from './getConfigFromEnvironment'

describe('getConfigFromEnvironment', () => {
  const validEnvironment = {
    NANO_TRUST_PROXY: 'yes',
    NANO_SESSION_ENCRYPTION_SECRET: randomBytes(32).toString('hex'),
    NANO_SESSION_ENCRYPTION_ALGORITHM: 'aes-256-gcm',
    NANO_SESSION_ID_COOKIE_NAME: '__Host-Session-Id',
    NANO_SESSION_TOKEN_COOKIE_NAME: '__Host-Session-Token',
    NANO_SESSION_DURATION: '3600000',
    NANO_USER_RECOVERY_TOKEN_DURATION: '1800000',
    NANO_VAULT_ENCRYPTION_SECRET: randomBytes(32).toString('hex'),
    NANO_VAULT_ENCRYPTION_ALGORITHM: 'aes-256-gcm',
    NANO_ICON_CDN_URL: 'https://esm.sh/',
    NANO_ICONIFY_URL: 'https://api.iconify.design',
    NANO_STORAGE_ENCRYPTION_SECRET: randomBytes(32).toString('hex'),
    NANO_STORAGE_ENCRYPTION_ALGORITHM: 'aes-256-gcm',
    NANO_STORAGE_PUBLIC_POOL_TYPE: 'local',
    NANO_STORAGE_PUBLIC_POOL_CONFIGURATION: JSON.stringify({ path: '/tmp/storage' }),
  }

  describe('NANO_SESSION_ENCRYPTION_SECRET', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.NANO_SESSION_ENCRYPTION_SECRET).toBe(validEnvironment.NANO_SESSION_ENCRYPTION_SECRET)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ENCRYPTION_SECRET: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ENCRYPTION_SECRET: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw value is too short', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ENCRYPTION_SECRET: 'short' })
      expect(shouldThrow).toThrowError('E_STRING_LENGTH_NOT_GREATER_THAN')
    })

    it('should throw if value is too long', () => {
      const longKey = 'a'.repeat(129)
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ENCRYPTION_SECRET: longKey })
      expect(shouldThrow).toThrowError('E_STRING_LENGTH_NOT_LOWER_THAN')
    })
  })

  describe('NANO_TRUST_PROXY', () => {
    it.each(['true', 'TRUE', 'yes', '1'])('should parse to true when value is %s', (value) => {
      const config = getConfigFromEnvironment( { ...validEnvironment, NANO_TRUST_PROXY: value })
      expect(config.NANO_TRUST_PROXY).toBe(true)
    })

    it('should default to false', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, NANO_TRUST_PROXY: undefined })
      expect(config.NANO_TRUST_PROXY).toBe(false)
    })

    it('should consider any value other than "true" as false', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, NANO_TRUST_PROXY: 'anything-else' })
      expect(config.NANO_TRUST_PROXY).toBe(false)
    })
  })

  describe('NANO_SESSION_ENCRYPTION_ALGORITHM', () => {
    it.each(['aes-256-gcm', 'aes-192-gcm', 'aes-128-gcm'])('should parse when value is %s', (algorithm) => {
      const config = getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ENCRYPTION_ALGORITHM: algorithm })
      expect(config.NANO_SESSION_ENCRYPTION_ALGORITHM).toBe(algorithm)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ENCRYPTION_ALGORITHM: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ENCRYPTION_ALGORITHM: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw if is not in the list of supported algorithms', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ENCRYPTION_ALGORITHM: 'invalid' })
      expect(shouldThrow).toThrowError('E_STRING_NOT_ONE_OF_VALUES')
    })
  })

  describe('NANO_SESSION_ID_COOKIE_NAME', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.NANO_SESSION_ID_COOKIE_NAME).toBe(validEnvironment.NANO_SESSION_ID_COOKIE_NAME)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ID_COOKIE_NAME: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_ID_COOKIE_NAME: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })
  })

  describe('NANO_SESSION_TOKEN_COOKIE_NAME', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.NANO_SESSION_TOKEN_COOKIE_NAME).toBe(validEnvironment.NANO_SESSION_TOKEN_COOKIE_NAME)
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_TOKEN_COOKIE_NAME: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })
  })

  describe('NANO_SESSION_DURATION', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.NANO_SESSION_DURATION).toBe(+validEnvironment.NANO_SESSION_DURATION)
    })

    it('should default to 24 hours if value is missing', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_DURATION: undefined })
      expect(config.NANO_SESSION_DURATION).toBe(1000 * 60 * 60 * 24)
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_DURATION: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw if value is not a positive number', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_DURATION: '-1' })
      expect(shouldThrow).toThrowError('E_NUMBER_NOT_POSITIVE')
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_SESSION_DURATION: 'invalid' })
      expect(shouldThrow).toThrowError('E_NOT_STRING_NUMBER')
    })
  })

  describe('NANO_USER_RECOVERY_TOKEN_DURATION', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.NANO_USER_RECOVERY_TOKEN_DURATION).toBe(+validEnvironment.NANO_USER_RECOVERY_TOKEN_DURATION)
    })

    it('should default to 30 minutes if value is missing', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, NANO_USER_RECOVERY_TOKEN_DURATION: undefined })
      expect(config.NANO_USER_RECOVERY_TOKEN_DURATION).toBe(1000 * 60 * 30)
    })

    it('should throw if value is not a positive number', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_USER_RECOVERY_TOKEN_DURATION: '-1' })
      expect(shouldThrow).toThrowError('E_NUMBER_NOT_POSITIVE')
    })

    it('should throw if value is not a number', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_USER_RECOVERY_TOKEN_DURATION: 'invalid' })
      expect(shouldThrow).toThrowError('E_NOT_STRING_NUMBER')
    })
  })

  describe('NANO_VAULT_ENCRYPTION_SECRET', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.NANO_VAULT_ENCRYPTION_SECRET).toBe(validEnvironment.NANO_VAULT_ENCRYPTION_SECRET)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_VAULT_ENCRYPTION_SECRET: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_VAULT_ENCRYPTION_SECRET: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw value is too short', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_VAULT_ENCRYPTION_SECRET: 'short' })
      expect(shouldThrow).toThrowError('E_STRING_LENGTH_NOT_GREATER_THAN')
    })

    it('should throw if NANO_VAULT_ENCRYPTION_SECRET is too long', () => {
      const longKey = 'a'.repeat(129)
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_VAULT_ENCRYPTION_SECRET: longKey })
      expect(shouldThrow).toThrowError('E_STRING_LENGTH_NOT_LOWER_THAN')
    })
  })

  describe('NANO_VAULT_ENCRYPTION_ALGORITHM', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.NANO_VAULT_ENCRYPTION_ALGORITHM).toBe(validEnvironment.NANO_VAULT_ENCRYPTION_ALGORITHM)
    })

    it('should throw if value is missing', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_VAULT_ENCRYPTION_ALGORITHM: undefined })
      expect(shouldThrow).toThrowError('E_IS_UNDEFINED')
    })

    it('should throw if value is empty', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_VAULT_ENCRYPTION_ALGORITHM: '' })
      expect(shouldThrow).toThrowError('E_STRING_EMPTY')
    })

    it('should throw if is not in the list of supported algorithms', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_VAULT_ENCRYPTION_ALGORITHM: 'invalid' })
      expect(shouldThrow).toThrowError('E_STRING_NOT_ONE_OF_VALUES')
    })
  })

  describe('NANO_ICON_CDN_URL', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.NANO_ICON_CDN_URL).toBe(validEnvironment.NANO_ICON_CDN_URL)
    })

    it('should default to https://esm.sh/ if value is missing', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, NANO_ICON_CDN_URL: undefined })
      expect(config.NANO_ICON_CDN_URL).toBe('https://esm.sh/')
    })

    it('should throw if value is not a valid URL', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_ICON_CDN_URL: 'invalid' })
      expect(shouldThrow).toThrowError('E_STRING_NOT_URL')
    })

    it('should throw if value does not use the HTTPS or HTTP protocol', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_ICON_CDN_URL: 'ftp://example.com' })
      expect(shouldThrow).toThrowError('E_STRING_URL_INVALID_PROTOCOL')
    })
  })

  describe('NANO_ICONIFY_URL', () => {
    it('should parse a valid value', () => {
      const config = getConfigFromEnvironment( validEnvironment)
      expect(config.NANO_ICONIFY_URL).toBe(validEnvironment.NANO_ICONIFY_URL)
    })

    it('should default to https://api.iconify.design/ if value is missing', () => {
      const config = getConfigFromEnvironment( { ...validEnvironment, NANO_ICONIFY_URL: undefined })
      expect(config.NANO_ICONIFY_URL).toBe('https://api.iconify.design/')
    })

    it('should throw if value is not a valid URL', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_ICONIFY_URL: 'invalid' })
      expect(shouldThrow).toThrowError('E_STRING_NOT_URL')
    })

    it('should throw if value does not use the HTTPS or HTTP protocol', () => {
      const shouldThrow = () => getConfigFromEnvironment( { ...validEnvironment, NANO_ICONIFY_URL: 'ftp://example.com' })
      expect(shouldThrow).toThrowError('E_STRING_URL_INVALID_PROTOCOL')
    })
  })
})

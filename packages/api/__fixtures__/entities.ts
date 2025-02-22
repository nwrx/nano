import { randomBytes } from 'node:crypto'

export const FIXTURE_USER = {
  username: randomBytes(8).toString('hex'),
  email: `${randomBytes(8).toString('hex')}@acme.com`,
}

export const FIXTURE_USER_BASIC = {
  username: 'john-doe',
  email: 'john-doe@acme.com',
}

export const FIXTURE_USER_ADMIN = {
  username: 'admin',
  email: 'admin@acme.com',
  isSuperAdministator: true,
}

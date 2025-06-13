import type { Project } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user/utils/assertUser'
import { assertProjectPermission } from './assertProjectPermission'

export const assertProject = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  assignments: [
    [assert.undefined],
    [assert.arrayOf({
      user: [[assert.undefined], [assertUser]],
      permission: assertProjectPermission,
    })],
  ],
}) as (value: unknown) => Project

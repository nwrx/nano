import type { Project } from '../entities'
import { assert, createArrayParser, createSchema } from '@unshared/validation'
import { assertUser } from '../../user/utils/assertUser'
import { assertProjectPermission } from './assertProjectPermission'

export const assertProject = createSchema({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  assignments: [
    [assert.undefined],
    [createArrayParser({
      user: [[assert.undefined], [assertUser]],
      permission: assertProjectPermission,
    })],
  ],
}) as (value: unknown) => Project

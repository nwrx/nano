import type { Workspace } from '../entities'
import { assert, createArrayParser, createSchema } from '@unshared/validation'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspacePermission } from './assertWorkspacePermission'

export const assertWorkspace = createSchema({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  assignments: [
    [assert.undefined],
    [createArrayParser({
      user: [[assert.undefined], [assertUser]],
      permission: assertWorkspacePermission,
    })],
  ],
}) as (value: unknown) => Workspace

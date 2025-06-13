import type { Workspace } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspacePermission } from './assertWorkspacePermission'

export const assertWorkspace = createParser({
  id: assert.stringUuid,
  name: assert.stringNotEmpty,
  assignments: [
    [assert.undefined],
    [assert.arrayOf({
      user: [[assert.undefined], [assertUser]],
      permission: assertWorkspacePermission,
    })],
  ],
}) as (value: unknown) => Workspace

import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'

export const assertUser = createSchema({
  id: assertStringUuid,
  username: assertStringNotEmpty,
})

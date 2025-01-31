import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleStorage } from '../../storage'

const ACCEPTED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
])

export function userSetAvatar(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'PUT /api/users/:username/avatar',
      parseParameters: createSchema({
        username: assert.stringNotEmpty,
      }),
      parseFormData: createSchema({
        avatar: assert.instance(File),
      }),
    },
    async({ event, parameters, formData }): Promise<void> => {
      const moduleStorage = this.getModule(ModuleStorage)
      const { user } = await this.authenticate(event)

      // --- Check if the user is allowed to upload an avatar.
      const { username } = parameters
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Assert the file is an image.
      const file = formData.avatar
      const isImage = ACCEPTED_IMAGE_TYPES.has(file.type)
      if (!isImage) throw this.errors.USER_AVATAR_NOT_IMAGE()

      // --- Create an abort signal to cancel the upload.
      const abortController = new AbortController()
      const abortSignal = abortController.signal
      event.node.req.on('aborted', () => abortController.abort())

      // // --- Find the user and upload the avatar.
      const { User } = this.getRepositories()
      const userToUpdate = await this.resolveUser({ user, username, withProfile: true })
      if (!userToUpdate.profile) throw new Error('Profile not found.')
      userToUpdate.profile.avatar = await moduleStorage.upload(file, { abortSignal })
      await User.save(userToUpdate)
    },
  )
}

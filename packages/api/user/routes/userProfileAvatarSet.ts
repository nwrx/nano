import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleStorage } from '../../storage'
import { getUser } from '../utils'

const ACCEPTED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
])

export function userSetAvatar(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'PUT /users/:username/avatar',
      parseParameters: createParser({
        username: assert.stringNotEmpty,
      }),
      parseFormData: createParser({
        file: [
          assert.file,
          assert.fileSizeLowerThan(50 * 1024 * 1024), // 50 MB
          assert.fileType(assert.stringEnum(
            'image/png',
            'image/jpeg',
            'image/webp',
          )),
        ],
      }),
    },
    async({ event, parameters, formData }): Promise<void> => {
      const moduleStorage = this.getModule(ModuleStorage)
      const { user } = await this.authenticate(event)
      const { username } = parameters
      const { file } = formData

      // --- Check if the user is allowed to upload an avatar.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_FORBIDDEN()

      // --- Assert the file is an image.
      const isImage = ACCEPTED_IMAGE_TYPES.has(file.type)
      if (!isImage) throw this.errors.USER_AVATAR_NOT_IMAGE()

      // --- Create an abort signal to cancel the upload when the request is aborted.
      const abortController = new AbortController()
      const abortSignal = abortController.signal
      event.node.req.on('aborted', () => abortController.abort())

      // --- Find the user and upload the avatar.
      const { User } = this.getRepositories()
      const userToUpdate = await getUser.call(this, { user, username, withProfile: true })
      const publicPool = await moduleStorage.getPublicPoolAdapter()

      // --- Create the avatar in the public storage pool.
      const avatar = await publicPool.upload(file, { abortSignal })
      avatar.createdBy = user
      userToUpdate.profile!.avatar = avatar
      await User.save(userToUpdate)
      setResponseStatus(event, 201)
    },
  )
}

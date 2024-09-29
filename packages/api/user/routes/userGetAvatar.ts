import type { ModuleUser } from '..'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleStorage } from '../../storage'

export function userGetAvatar(this: ModuleUser) {
  return createRoute(
    {
      name: 'GET /api/users/:username/avatar',
      parameters: createSchema({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const storageModule = this.getModule(ModuleStorage)
      const { username } = parameters
      const user = await this.resolveUser(username, { profile: { avatar: true } })

      // --- If the user does not have an avatar, return a default image.
      if (!user.profile) throw new Error('Profile not found.')
      if (!user.profile.avatar)
        return `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-6h4v2h-4v-2zm0-4h4v3h-2v-1h-2v-2zm1-7c-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4v-2z"/></svg>')}`

      // --- Return the avatar URL of the user.
      return storageModule.respondWith(event, user.profile.avatar)
    },
  )
}

import type { ModuleUser } from '..'
import { createHttpRoute } from '@unserved/server'
import { dedent, parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { setResponseHeader } from 'h3'
import { ModuleStorage } from '../../storage'
import { getUser } from '../utils'

export function userGetAvatar(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'GET /api/users/:username/avatar',
      parseParameters: createSchema({
        username: assertStringNotEmpty,
      }),
      parseQuery: createSchema({
        download: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const storageModule = this.getModule(ModuleStorage)
      const { user } = await this.authenticate(event, { optional: true }) ?? {}
      const { username } = parameters
      const { download } = query

      // --- Resolve the user to get the avatar of.
      const userToGet = await getUser.call(this, {
        user,
        username,
        withProfile: true,
        withDeleted: user?.isSuperAdministrator,
        withDisabled: user?.isSuperAdministrator,
      })

      // --- If the user does not have an avatar, return a simple SVG.
      if (!userToGet.profile!.avatar) {
        setResponseHeader(event, 'Cache-Control', 'no-cache')
        setResponseHeader(event, 'Content-Type', 'image/svg+xml')
        return dedent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <circle cx="50" cy="50" r="50" fill="#f0f0f0"/>
            <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="40" fill="#000000">
              ${userToGet.username.split(' ').map(word => word[0].toUpperCase()).join('')}
            </text>
          </svg>
        `)
      }

      // --- Return the avatar URL of the user.
      return storageModule.respondWith(event, userToGet.profile!.avatar, {
        isAttachment: download,
      })
    },
  )
}

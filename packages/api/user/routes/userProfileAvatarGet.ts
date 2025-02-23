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
      const { user } = await this.authenticate(event, { optional: true })
      const { username } = parameters
      const { download } = query

      // --- Resolve the user to get the avatar of.
      const found = await getUser.call(this, {
        user,
        username,
        withProfile: true,
        withDeleted: Boolean(user?.isSuperAdministrator),
        withDisabled: Boolean(user?.isSuperAdministrator),
      })

      // --- Redirect to the avatar file.
      if (found.profile?.avatar)
        return storageModule.respondWith(event, found.profile.avatar, { isAttachment: download })

      // --- If the user does not have an avatar, return a simple SVG.
      setResponseHeader(event, 'Cache-Control', 'no-cache')
      setResponseHeader(event, 'Content-Type', 'image/svg+xml')
      if (download) setResponseHeader(event, 'Content-Disposition', 'attachment; filename="avatar.svg"')

      // --- Create the initials of the user.
      const initials = found.profile
        ? found.profile.displayName.split(' ').map(word => word[0].toUpperCase()).join('')
        : '??'

      // Create a simple SVG with the initials of the user.
      return dedent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <circle cx="50" cy="50" r="50" fill="#f0f0f0"/>
          <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="40" fill="#000000">
            ${initials}
          </text>
        </svg>
      `)
    },
  )
}

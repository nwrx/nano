import type { ModuleIcon } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { setHeader } from 'h3'
import { ModuleStorage } from '../../storage'
import { getIcon } from '../utils'

export function iconDownload(this: ModuleIcon) {
  return createHttpRoute(
    {
      name: 'GET /api/icons/:name',
      parseParameters: createParser({
        name: [assert.stringNotEmpty],
      }),
      parseQuery: createParser({
        color: [[assert.undefined], [assert.string]],
      }),
    },
    async({ event, parameters, query }) => {
      const moduleStorage = this.getModule(ModuleStorage)
      const { name } = parameters
      const { color } = query

      // --- Get the icon and respond if no color is specified.
      const icon = await getIcon.call(this, { name, withFile: true })
      if (!color) return moduleStorage.respondWith(event, icon.file!)

      // --- If a color is specified, we need to modify the SVG.
      const file = await moduleStorage.download(icon.file!)
      let svg = await file.getText()
      svg = svg.replaceAll('currentColor', color)
      svg.replaceAll(/width="[^"]+"/g, 'width="24px"')
      svg.replaceAll(/height="[^"]+"/g, 'height="24px"')
      setHeader(event, 'Content-Type', await file.getContentType())
      setHeader(event, 'Content-Length', svg.length)
      setHeader(event, 'Cache-Control', 'public, max-age=31536000')
      return svg
    },
  )
}

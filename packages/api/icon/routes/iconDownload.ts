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
        width: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        height: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        size: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
      }),
    },
    async({ event, parameters, query }) => {
      const moduleStorage = this.getModule(ModuleStorage)
      const { name } = parameters
      const { color, size, height = size, width = size } = query

      // --- Get the icon and respond if no color is specified.
      const icon = await getIcon.call(this, { name, withFile: true, withCollection: true })
      if (!color && !height && !width) return moduleStorage.respondWith(event, icon.file!)

      // --- If a color is specified, we need to modify the SVG.
      const file = await moduleStorage.download(icon.file!)
      let svg = await file.getText()
      if (color) svg = svg.replaceAll('currentColor', color)
      if (width) svg.replaceAll(/width="[^"]+"/g, `width="${width}px"`)
      if (height) svg.replaceAll(/height="[^"]+"/g, `height="${height}px"`)
      setHeader(event, 'Content-Type', icon.file!.type)
      setHeader(event, 'Content-Length', svg.length)
      setHeader(event, 'Cache-Control', 'public, max-age=31536000')
      return svg
    },
  )
}

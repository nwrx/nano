import { ILike } from 'typeorm'
import { UUID } from 'node:crypto'
import { EXP_UUID, assertStringNotEmpty, assertUndefined, createSchema } from 'unshared'
import { createRoute } from '@unserved/server'
import { ChainModule } from '@hsjm/oblisk-core'
import { ModuleChain } from '..'

export function moduleGet(this: ModuleChain) {
  return createRoute(
    {
      name: 'GET /api/modules/:idOrSlug',
      parameters: createSchema({
        idOrSlug: assertStringNotEmpty,
      }),
    },
    async({ parameters }) => {
      const { ChainModule } = this.entities
      const { idOrSlug } = parameters

      // --- Find the module by ID or slug.
      const isUUID = EXP_UUID.test(idOrSlug)
      const module = await ChainModule.findOne({
        where: isUUID ? { id: idOrSlug as UUID } : { slug: idOrSlug },
      })

      // --- If the module is not found, return a 404.
      if (!module) throw this.errors.CHAIN_MODULE_NOT_FOUND(idOrSlug)
      return module.serialize()
    },
  )
}

export function moduleSearch(this: ModuleChain) {
  return createRoute(
    {
      name: 'GET /api/modules',
      query: createSchema({
        search: [[assertUndefined], [assertStringNotEmpty]],
      }),
    },
    async({ query }) => {
      const { ChainModule } = this.entities
      const { search } = query

      // --- Search for modules by name or description.
      const modules = await ChainModule.find({
        where: [
          { name: search ? ILike(`%${search}%`) : undefined },
          { description: search ? ILike(`%${search}%`) : undefined },
        ],
      })

      return modules.map(module => module.serialize())
    },
  )
}

export function moduleImport(this: ModuleChain) {
  return createRoute(
    {
      name: 'POST /api/modules',
      body: createSchema({
        moduleId: assertStringNotEmpty,
      }),
    },
    async({ body }) => {
      const { ChainModule } = this.entities
      const { moduleId } = body

      const module = await import(moduleId) as ChainModule
      const chainModule = new ChainModule()
      chainModule.name = module.label
      chainModule.slug = module.name
      chainModule.moduleId = moduleId
      chainModule.description = module.description ?? ''
    },
  )
}

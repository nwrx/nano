import type { FlowModule as FlowModuleConstructor } from '@nanoworks/core'
import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, assertUndefined, createSchema } from 'unshared'

export function moduleImport(this: ModuleFlow) {
  return createRoute(
    {
      name: 'POST /api/modules',
      body: createSchema({
        moduleId: assertStringNotEmpty,
        moduleContent: [[assertUndefined], [assertStringNotEmpty]],
      }),
    },
    async({ body }) => {
      const { FlowModule } = this.entities
      const { moduleId /* , moduleContent */ } = body

      // --- Import the module.
      const moduleImport = await import(moduleId) as { default: FlowModuleConstructor }
      const moduleInstance = moduleImport.default

      // --- Create and save the module.
      const moduleEntity = new FlowModule()
      moduleEntity.name = moduleInstance.name
      moduleEntity.kind = moduleInstance.kind
      moduleEntity.moduleId = moduleId
      moduleEntity.description = moduleInstance.description ?? ''

      // --- Save the module.
      await moduleEntity.save()
      return moduleEntity.serialize()
    },
  )
}

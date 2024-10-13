import type { Module } from '@nwrx/core'
import type { FlowModule, ModuleFlow } from '../index'
import { EXP_UUID } from '@unshared/validation'

export interface ResolvedFlowModule {
  module: Module
  entity: FlowModule
}

/**
 * Given a flow module identifier, resolves the module that is associated with the module.
 *
 * @param idOrKind The module identifier of the module to resolve.
 * @returns The module that is associated with the module.
 */
export async function resolveModule(this: ModuleFlow, idOrKind: string): Promise<ResolvedFlowModule> {

  // --- Find the entity that is associated with the module.
  const { FlowModule } = this.getRepositories()
  const isUUID = EXP_UUID.test(idOrKind)
  const moduleEntity = await FlowModule.findOneBy({ [isUUID ? 'id' : 'kind']: idOrKind })
  if (!moduleEntity) throw new Error(`Failed to find module: ${idOrKind}`)

  const moduleImport = await import(moduleEntity.moduleId) as { default: Module }
  if (!moduleImport) throw new Error(`Failed to load module: ${idOrKind}`)
  if (!moduleImport.default) throw new Error(`Module does not have a default export: ${idOrKind}`)

  // if (moduleImport.default instanceof FlowModuleInstance === false)
  //   throw new Error(`Module is not an instance of FlowModule: ${idOrKind}`)

  // --- Return the module that is associated with the module.
  return {
    module: moduleImport.default,
    entity: moduleEntity,
  }
}

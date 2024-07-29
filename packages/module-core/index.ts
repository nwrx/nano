import { coreTypeString } from './coreTypeString'
import { coreTypeObject } from './coreTypeObject'
import { coreTypeNumber } from './coreTypeNumber'
import { coreTypeBoolean } from './coreTypeBoolean'
import { coreNodeJsonParse } from './coreNodeJsonParse'
import { coreNodeEntrypoint } from './coreNodeEntrypoint'
import { defineChainModule } from '../chain'

export * from './coreNodeEntrypoint'
export * from './coreNodeJsonParse'
export * from './coreTypeBoolean'
export * from './coreTypeNumber'
export * from './coreTypeObject'
export * from './coreTypeString'

export default defineChainModule({
  name: 'core',
  label: 'Core',
  description: 'Basic nodes and types for building chains',
  nodes: {
    coreNodeEntrypoint,
    coreNodeJsonParse,
  },
  types: {
    coreTypeNumber,
    coreTypeString,
    coreTypeBoolean,
    coreTypeObject,
  },
})

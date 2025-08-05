import type { RemoveEvent, RenameEvent } from '../../utils'
import type { RunnerObject } from '../entities'

export type RunnersEvent =
  | { event: 'runners.created'; data: RunnerObject }
  | { event: 'runners.removed'; data: RemoveEvent }
  | { event: 'runners.renamed'; data: RenameEvent }
  | { event: 'runners.updated'; data: RunnerObject }

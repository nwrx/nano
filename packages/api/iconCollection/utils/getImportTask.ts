import type { Loose } from '@unshared/types'
import type { ModuleIconCollection } from '../index'
import type { ImportTask } from './createImportTask'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'
import { createImportTask } from './createImportTask'

export const GET_IMPORT_TASK_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  name: assert.stringNotEmpty,
})

export type GetImportTaskOptions = Loose<ReturnType<typeof GET_IMPORT_TASK_OPTIONS_SCHEMA>>

export function getImportTask(this: ModuleIconCollection, options: GetImportTaskOptions): ImportTask {
  const moduleUser = this.getModule(ModuleUser)
  const { name, user } = GET_IMPORT_TASK_OPTIONS_SCHEMA(options)

  // --- Check if the user is a super administrator.
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

  // --- Check if there is already an import task for this collection.
  const existingTask = this.iconImportTasks.get(name)
  if (existingTask) return existingTask

  // --- Create a new import task.
  const importTask = createImportTask.call(this, name)
  this.iconImportTasks.set(name, importTask)
  void importTask.import()
  return importTask
}

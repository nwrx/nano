import type { Schema, SchemaControl, SchemaOption } from '@nwrx/nano/utils'
import type { MaybeLiteral } from '@unshared/types'
import type { OutputJSON } from './serializeOutputSchema'

export interface InputJSON extends OutputJSON {
  control?: MaybeLiteral<SchemaControl>
  options?: SchemaOption[]
  sliderMax?: number
  sliderMin?: number
  sliderStep?: number
  defaultValue?: unknown
  isOptional?: boolean
  isIterable?: boolean
}

export function serializeInputSchema(schema?: Schema): InputJSON[] {
  if (!schema) return []
  return Object
    .entries(schema)
    .filter(([, socket]) => !socket.isInternal)
    .map(([key, socket]) => ({
      key,
      name: socket.name ?? key,
      typeKind: socket.type?.kind,
      typeName: socket.type?.name,
      typeColor: socket.type?.color,
      typeDescription: socket.type?.description,
      control: socket.control,
      description: socket.description,
      options: typeof socket.options === 'function' ? undefined : socket.options,
      sliderMax: socket.sliderMax,
      sliderMin: socket.sliderMin,
      sliderStep: socket.sliderStep,
      defaultValue: socket.defaultValue,
      isOptional: socket.isOptional,
      isIterable: socket.isIterable,
    }))
}

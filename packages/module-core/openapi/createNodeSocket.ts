import type { InputSocket } from '@nwrx/core'
import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types'
import { number, object, string } from '../types'

export function createNodeSocket(schema: OpenAPIV2.SchemaObject | OpenAPIV3.SchemaObject = {}): Partial<InputSocket> {
  if (schema.type === 'object') {
    return {
      type: object,
      defaultValue: schema.default,
    }
  }
  if (schema.type === 'integer' || schema.type === 'number') {
    return {
      type: number,
      control: 'slider',
      defaultValue: schema.default,
    }
  }
  if (schema.type === 'string') {
    return {
      type: string,
      control: schema.enum ? 'select' : 'text',
      options: schema.enum ? schema.enum.map((value: string) => ({ value, label: value })) : undefined,
      defaultValue: schema.default,
    }
  }
  return {
    type: string,
    control: 'text',
    defaultValue: schema.default,
  }
}

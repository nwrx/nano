import type { DataFromSchema, DataSchema, DataSocket } from './defineDataSchema'
import { defineDataSchema } from './defineDataSchema'

export const schema = defineDataSchema<{ value: string; name?: string }>({
  value: {
    type: { kind: 'Value', parse: String },
    label: 'Value',
    description: 'The value to process.',
    // @ts-expect-error: should be `false` | `undefined`
    isOptional: true,
  },
  name: {
    type: { kind: 'Value', parse: String },
    label: 'Name',
    description: 'The name to process.',
    // @ts-expect-error: should be `true`
    isOptional: false,
  },
})

export const schemaError = defineDataSchema<{ value: string; name?: string }>({
  value: {
    type: { kind: 'Value', parse: String },
    name: 'Value',
    description: 'The value to process.',
    isOptional: false,
  },
  name: {
    type: { kind: 'Value', parse: String },
    name: 'Name',
    description: 'The name to process.',
    isOptional: true,
  },
})

export const schema2 = defineDataSchema({
  value: {
    type: { kind: 'Value', parse: String },
    label: 'Value',
    description: 'The value to process.',
    isOptional: true,
  },
  value2: {
    type: { kind: 'Value', parse: String },
    label: 'Value',
    description: 'The value to process.',
    isOptional: false,
  },
  value3: {
    type: { kind: 'Value', parse: String },
    label: 'Value',
    description: 'The value to process.',
  },
})

export type TestA = Pick<DataSocket<string>, 'isOptional'>
export type TestB = Pick<DataSchema[string], 'isOptional'>
export type TestC = Pick<DataSchema<{ v?: string }>['v'], 'isOptional'>

type TestOptional = DataSchema<{ value?: string }>
type TestRequired = DataSchema<{ value: string }>

export type TestInferOptional = { value?: string | undefined } & DataFromSchema<TestOptional>
export type TestInferRequired = { value: string } & DataFromSchema<TestRequired>

test('should return the value as-is', () => {
  const value = { value: { type: { kind: 'string', parse: String } } }
  const schema = defineDataSchema(value)
  expect(schema).toBe(value)
})

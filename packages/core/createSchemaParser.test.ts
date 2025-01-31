import { typeNumber, typeString } from './__fixtures__'
import { createSchemaParser } from './createSchemaParser'

describe('createSchemaParser', () => {
  it('should create a schema parser when the port has a type', () => {
    const parser = createSchemaParser({ string: { type: typeString } })
    const value = parser({ string: 'Hello, World!' })
    expect(value).toStrictEqual({ string: 'Hello, World!' })
  })

  it('should return an empty object when the schema is empty', () => {
    const parser = createSchemaParser({})
    const value = parser({})
    expect(value).toStrictEqual({})
  })

  it('should infer the type of the value', () => {
    const parser = createSchemaParser({
      string: { type: typeString },
      number: { type: typeNumber },
    })
    const value = parser({
      string: 'Hello, World!',
      number: 42,
      boolean: true,
    })
    expectTypeOf(value).toEqualTypeOf<{
      string: string
      number: number
    }>()
  })
})

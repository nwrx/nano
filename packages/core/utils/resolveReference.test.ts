import type { ReferenceResolver } from './resolveReference'
import { ERRORS as E } from './errors'
import { resolveReference } from './resolveReference'

describe('resolveReference', () => {
  it('should call the resolver with the correct type and values', async() => {
    const resolver = vi.fn(() => 'resolvedValue')
    const result = await resolveReference({ $ref: '#/Example/Foo/Bar' }, [resolver])
    expect(result).toBe('resolvedValue')
    expect(resolver).toHaveBeenCalledWith('Example', 'Foo', 'Bar')
  })

  it('should resolve the second reference if the first is not resolved', async() => {
    const resolver = () => undefined
    const result = await resolveReference({ $ref: '#/Example/Foo/Bar' }, [resolver, () => 'resolvedValue'])
    expect(result).toBe('resolvedValue')
  })

  it('should call the resolvers in order', async() => {
    const resolver1 = vi.fn(() => undefined)
    const resolver2 = vi.fn(() => 'resolvedValue')
    await resolveReference({ $ref: '#/Example/Foo/Bar' }, [resolver1, resolver2])
    expect(resolver1).toHaveBeenCalledOnce()
    expect(resolver2).toHaveBeenCalledOnce()
  })

  it('should throw an error if the reference is invalid', async() => {
    const resolver: ReferenceResolver = () => undefined
    const shouldReject = resolveReference({ $ref: 'InvalidReference' }, [resolver])
    const error = E.REFERENCE_INVALID_FORMAT()
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if all resolvers return undefined', async() => {
    const resolver: ReferenceResolver = () => undefined
    const shouldReject = resolveReference({ $ref: '#/Example/Foo/Bar' }, [resolver])
    const error = E.REFERENCE_UNRESOLVED('#/Example/Foo/Bar')
    await expect(shouldReject).rejects.toThrow(error)
  })
})

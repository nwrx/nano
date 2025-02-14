import type { SpecifierObject } from './parseSpecifier'
import type { ComponentResolver } from './resolveComponent'
import { defineComponent } from './defineComponent'
import { ERRORS as E } from './errors'
import { resolveComponent } from './resolveComponent'

describe('resolveComponent', () => {
  const component = defineComponent({ title: 'Example' })
  const specifier: SpecifierObject = {
    tag: 'latest',
    registry: 'example.com',
    collection: 'my-collection',
    name: 'my-component',
  }

  it('should resolve a valid component', async() => {
    const resolver = () => component
    const result = await resolveComponent(specifier, [resolver])
    expect(result).toBe(component)
  })

  it('should call the resolver with the correct specifier', async() => {
    const resolver = vi.fn(() => component)
    await resolveComponent(specifier, [resolver])
    expect(resolver).toHaveBeenCalledWith(specifier)
  })

  it('should resolve the second component if the first is not resolved', async() => {
    const result = await resolveComponent(specifier, [() => undefined, () => component])
    expect(result).toBe(component)
  })

  it('should call the resolvers in order', async() => {
    const resolver1 = vi.fn(() => undefined)
    const resolver2 = vi.fn(() => component)
    await resolveComponent(specifier, [resolver1, resolver2])
    expect(resolver1).toHaveBeenCalledOnce()
    expect(resolver2).toHaveBeenCalledOnce()
  })

  it('should not call the resolver with more properties than needed', async() => {
    const resolver = vi.fn(() => component)
    // @ts-expect-error: The extra property is not allowed.
    await resolveComponent({ ...specifier, extra: 'property' }, [resolver])
    expect(resolver).toHaveBeenCalledWith(specifier)
  })

  it('should throw an error if the component is not resolved', async() => {
    const resolver: ComponentResolver = () => undefined
    const shouldReject = resolveComponent(specifier, [resolver])
    const error = E.COMPONENT_NOT_RESOLVED(specifier)
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the result of the resolve if not a valid component', async() => {
    const resolver = () => ({ title: 'Invalid' })
    // @ts-expect-error: The component is invalid.
    const shouldReject = resolveComponent(specifier, [resolver])
    const error = E.COMPONENT_RESOLVED_BUT_NOT_COMPONENT(specifier)
    await expect(shouldReject).rejects.toThrow(error)
  })
})

import type { ComponentResolver } from './resolveComponent'
import { defineComponent } from './defineComponent'
import { resolveComponent } from './resolveComponent'

describe('resolveComponent', () => {
  const component = defineComponent({ title: 'Example' })

  it('should resolve a valid component', async() => {
    const resolver = () => component
    const result = await resolveComponent('module/validComponent', [resolver])
    expect(result).toBe(component)
  })

  it('should call the resolver with the correct specifier', async() => {
    const resolver = vi.fn(() => component)
    await resolveComponent('example.com:module@1/validComponent', [resolver])
    expect(resolver).toHaveBeenCalledWith({
      providerName: 'example.com',
      moduleName: 'module',
      moduleVersion: '1',
      componentName: 'validComponent',
    })
  })

  it('should resolve the second component if the first is not resolved', async() => {
    const resolver = () => undefined
    const result = await resolveComponent('module/validComponent', [resolver, () => component])
    expect(result).toBe(component)
  })

  it('should call the resolvers in order', async() => {
    const resolver1 = vi.fn(() => undefined)
    const resolver2 = vi.fn(() => component)
    await resolveComponent('module/validComponent', [resolver1, resolver2])
    expect(resolver1).toHaveBeenCalledOnce()
    expect(resolver2).toHaveBeenCalledOnce()
  })

  it('should throw an error if the component is not resolved', () => {
    const resolver: ComponentResolver = () => undefined
    const shouldThrow = () => resolveComponent('module/invalidComponent', [resolver])
    expect(shouldThrow).toThrow('The component with specifier "module/invalidComponent" could not be resolved.')
  })

  it('should throw an error if the component is not valid', async() => {
    const resolver = () => ({ title: 'Invalid' })
    const shouldReject = resolveComponent('module/invalidComponent', [resolver])
    await expect(shouldReject).rejects.toThrow('The component with specifier "module/invalidComponent" could was resolved but is not a valid component.')
  })
})

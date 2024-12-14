/* eslint-disable vue/component-definition-name-casing */
import { defineComponent } from './defineComponent'
import { defineModule } from './defineModule'

describe('defineModule', () => {
  it('should define a module with the given options', () => {
    const component = defineComponent({ name: 'exampleComponent', version: '1.0.0' })
    const module = defineModule({
      name: 'example-module',
      title: 'Example Module',
      description: 'This is an example module.',
      components: { component },
    })

    expect(module).toMatchObject({
      name: 'example-module',
      title: 'Example Module',
      description: 'This is an example module.',
      components: { component },
    })
  })

  it('should use the name as the title if the title is not provided', () => {
    const module = defineModule({ name: 'example-module', components: {} })
    expect(module.title).toBe('example-module')
  })
})

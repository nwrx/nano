import { definePrompt } from './definePrompt'

describe('definePrompt', () => {
  it('should create a prompt with string arguments', () => {
    const handler = vi.fn()
    const prompt = definePrompt({
      name: 'greet',
      description: 'Greeting prompt.',
      arguments: ['name', 'greeting'],
    }, handler)
    expect(prompt).toEqual({
      name: 'greet',
      description: 'Greeting prompt.',
      arguments: ['name', 'greeting'],
      handler,
    })
  })

  it('should create a prompt with object arguments', () => {
    const handler = vi.fn()
    const prompt = definePrompt({
      name: 'introduce',
      description: 'Introduction prompt.',
      arguments: [
        { name: 'name', description: 'The person\'s name', required: true },
        { name: 'occupation', description: 'The person\'s job' },
      ],
    }, handler)
    expect(prompt).toEqual({
      name: 'introduce',
      description: 'Introduction prompt.',
      arguments: [
        { name: 'name', description: 'The person\'s name', required: true },
        { name: 'occupation', description: 'The person\'s job' },
      ],
      handler,
    })
  })

  it('should create a prompt with mixed argument types', () => {
    const handler = vi.fn()
    const prompt = definePrompt({
      name: 'mixed',
      description: 'Mixed arguments prompt.',
      arguments: ['simple', { name: 'complex', description: 'A complex argument' }],
    }, handler)
    expect(prompt).toEqual({
      name: 'mixed',
      description: 'Mixed arguments prompt.',
      arguments: ['simple', { name: 'complex', description: 'A complex argument' }],
      handler,
    })
  })

  it('should create a prompt without arguments', () => {
    const handler = vi.fn()
    const prompt = definePrompt({
      name: 'simple',
      description: 'Simple prompt without arguments.',
    }, handler)
    expect(prompt).toEqual({
      name: 'simple',
      description: 'Simple prompt without arguments.',
      handler,
    })
  })
})

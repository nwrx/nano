import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { addNode, createThread, startNode } from '../../thread'
import { script } from './script'

describe('script component', () => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1'
  const data = { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
  const handler = http.get(url, () => HttpResponse.json(data))
  const server = setupServer(handler)

  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  describe('JavaScript', () => {
    it('executes JavaScript code in the sandbox', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'script', {
        component: script,
        input: { language: 'javascript', code: '() => "Hello, World!"' },
      })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ result: 'Hello, World!' })
    })

    it('executes JavaScript code with input number in the sandbox', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'script', {
        component: script,
        input: { language: 'javascript', code: '(n) => n * 2', input: 21 },
      })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ result: 42 })
    })

    it('executes JavaScript code with input object in the sandbox', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'script', {
        component: script,
        input: { language: 'javascript', code: '({ value }) => value * 2', input: { value: 21 } },
      })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ result: 42 })
    })
  })

  describe('TypeScript', () => {
    it('executes TypeScript code in the sandbox', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'script', {
        component: script,
        input: { language: 'typescript', code: '() => "Hello, World!" as string' },
      })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ result: 'Hello, World!' })
    })

    it('executes TypeScript code with input number in the sandbox', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'script', {
        component: script,
        input: { language: 'typescript', code: '(n: number) => n * 2', input: 21 },
      })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ result: 42 })
    })

    it('executes TypeScript code with input object in the sandbox', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'script', {
        component: script,
        input: { language: 'typescript', code: '({ value }: { value: number }) => value * 2', input: { value: 21 } },
      })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ result: 42 })
    })
  })

  describe('fetch', () => {
    it('should fetch data from the server', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'script', {
        component: script,
        input: {
          language: 'javascript',
          code: `async() => {
          const response = await fetch('${url}')
          const data = await response.json()
          return data
        }`,
        },
      })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ result: data })
    })
  })
})

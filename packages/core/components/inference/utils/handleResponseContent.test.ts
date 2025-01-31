import { handleResponseContent } from './handleResponseContent'

describe('handleResponseContent', () => {
  it('should return a promise that returns undefined', async() => {
    const controller = { enqueue: vi.fn() }
    // @ts-expect-error: mock controller
    const result = handleResponseContent(controller, 'Hello, world!')
    expect(result).toBeInstanceOf(Promise)
    await expect(result).resolves.toBeUndefined()
  })

  it('should enqueue a string content correctly', async() => {
    const controller = { enqueue: vi.fn() }
    // @ts-expect-error: mock controller
    await handleResponseContent(controller, 'Hello, world!')
    expect(controller.enqueue).toHaveBeenCalledWith('Hello, world!')
  })

  it('should enqueue an array of strings correctly', async() => {
    const controller = { enqueue: vi.fn() }
    // @ts-expect-error: mock controller
    await handleResponseContent(controller, ['Hello, ', 'world!'])
    expect(controller.enqueue).toHaveBeenCalledWith('Hello, world!')
  })

  it('should enqueue a ReadableStream content correctly', async() => {
    const controller = { enqueue: vi.fn() }
    const stream = new ReadableStream<string>({
      start(controller) {
        controller.enqueue('Hello, ')
        controller.enqueue('world!')
        controller.close()
      },
    })
    // @ts-expect-error: mock controller
    await handleResponseContent(controller, stream)
    expect(controller.enqueue).toHaveBeenNthCalledWith(1, 'Hello, ')
    expect(controller.enqueue).toHaveBeenNthCalledWith(2, 'world!')
  })
})

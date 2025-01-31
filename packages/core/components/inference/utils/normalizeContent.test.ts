import { normalizeContent } from './normalizeContent'

describe('normalizeContent', () => {
  it('should normalize a File to a Base64 string', async() => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    const result = await normalizeContent(file)
    expect(result).toStrictEqual('aGVsbG8=')
  })

  it('should normalize a ReadableStream to a string', async() => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('hello'))
        controller.close()
      },
    })
    const result = await normalizeContent(stream)
    expect(result).toStrictEqual('hello')
  })

  it('should normalize an object to a JSON string', async() => {
    const result = await normalizeContent({ key: 'value' })
    expect(result).toStrictEqual('{"key":"value"}')
  })

  it('should normalize an array to a JSON string', async() => {
    const result = await normalizeContent([1, 2, 3])
    expect(result).toStrictEqual('[1,2,3]')
  })

  it('should normalize a string', async() => {
    const result = await normalizeContent('hello')
    expect(result).toStrictEqual('hello')
  })

  it('should normalize a number to a string', async() => {
    const result = await normalizeContent(123)
    expect(result).toStrictEqual('123')
  })

  it('should normalize a boolean to a string', async() => {
    const bool = true
    const result = await normalizeContent(bool)
    expect(result).toStrictEqual(bool.toString())
  })

  it('should throw an error for unsupported types', async() => {
    // @ts-expect-error: testing invalid type
    const shouldReject = normalizeContent(null)
    await expect(shouldReject).rejects.toThrow(TypeError)
    await expect(shouldReject).rejects.toThrow('The content type is not supported.')
  })
})

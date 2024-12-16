import { dedent } from '@unshared/string'

export function createWrapperCode(fn: (...args: any[]) => any) {
  return dedent(`
    const __wrappedStreamMap = new Map()

    function __registerStream(id) {
      __wrappedStreamMap.set(id, { done: false, ready: Promise.withResolvers(), chunks: [] })
    }

    function __isWrappedReadableStreamReference(value) {
      return typeof value === 'object'
        && value !== null
        && '_streamId' in value
        && typeof value._streamId === 'string'
    }

    function __pushStreamChunk(id, chunk, done) {
      const stream = __wrappedStreamMap.get(id)
      if (!stream) throw new Error('Stream not found.')
      stream.chunks.push(chunk)
      stream.done = done
      stream.ready.resolve()
      stream.ready = Promise.withResolvers()
    }

    function __unwrapReadableStream(value) {
      const stream = __wrappedStreamMap.get(value._streamId)
      if (!stream) throw new Error('Stream not found.')
      const reader = {
        read() {
          if (stream.chunks.length === 0) return stream.ready.promise.then(() => reader.read())
          const chunk = stream.chunks.shift()
          return { value: chunk, done: stream.done }
        },
      }
      return {
        getReader: () => reader,
      }
    }

    function __unwrapObject(object) {
      const result = {}
      for (const key in object) {
        const value = object[key]
        result[key] = __isWrappedReadableStreamReference(value)
          ? __unwrapReadableStream(value)
          : object[key]
      }
      return result
    }

    class TextDecoder {
      decode(buffer) {
        const result = []
        for (const byte of buffer) {
          const code = byte & 0xFF
          result.push(code)
        }
        return String.fromCodePoint(...result)
      }
    }

    const __processRaw = ${fn.toString()}

    function __process({ data, trace }) {
      return __processRaw({
        data: __unwrapObject(data),
        trace: (...parameters) => trace.apply(undefined, parameters, { arguments: { copy: true } }),
      })
    }
  `)
}

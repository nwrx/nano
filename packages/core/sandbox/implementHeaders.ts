import type ivm from 'isolated-vm'

/**
 * Provides the Headers class to the isolate.
 *
 * @param isolate The isolate to register the Headers class in.
 * @param context The context to register the Headers class in.
 */
export async function implementHeaders(isolate: ivm.Isolate, context: ivm.Context): Promise<void> {
  const script = await isolate.compileScript(`
    class Headers {
      constructor(init = {}) {
        this.headers = new Map()
        if (Array.isArray(init)) {
          for (const [key, value] of init) {
            this.append(key, value)
          }
        } else if (init instanceof Headers) {
          for (const [key, value] of init.entries()) {
            this.append(key, value)
          }
        } else if (typeof init === 'object') {
          for (const key of Object.keys(init)) {
            this.append(key, init[key])
          }
        }
      }
      append(key, value) {
        key = key.toLowerCase()
        if (this.headers.has(key)) {
          this.headers.set(key, this.headers.get(key) + ', ' + value)
        } else {
          this.headers.set(key, value)
        }
      }
      delete(key) {
        this.headers.delete(key.toLowerCase())
      }
      get(key) {
        return this.headers.get(key.toLowerCase()) || null
      }
      has(key) {
        return this.headers.has(key.toLowerCase())
      }
      set(key, value) {
        this.headers.set(key.toLowerCase(), value)
      }
      forEach(callback, thisArg) {
        for (const [key, value] of this.headers) {
          callback.call(thisArg, value, key, this)
        }
      }
      keys() {
        return Object.keys(this.headers)
      }
      values() {
        return Object.values(this.headers)
      }
      entries() {
        return this.headers.entries()
      }
      [Symbol.iterator]() {
        function * createIterator() {
          for (const [key, value] of this.headers) {
            yield [key, value]
          }
        }
        return createIterator()
      }
    }
  `)
  await script.run(context)
}

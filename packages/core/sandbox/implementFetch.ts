import ivm from 'isolated-vm'
import { dererenceDeep } from './dererenceDeep'

export async function implementFetch(isolate: ivm.Isolate, context: ivm.Context) {

  // --- Wrap the `fetch` function in a `Reference` to pass it to the VM. Before return the response,
  // --- we need to wrap some methods of the response object to make them work in the VM.
  const reference = new ivm.Reference(async(urlRef: ivm.Reference<string>, initRef: ivm.Reference<RequestInit>) => {
    const url = dererenceDeep(urlRef)
    const init = dererenceDeep(initRef)
    const response = await globalThis.fetch(url, init)
    return {
      ok: response.ok,
      url: response.url,
      type: response.type,
      status: response.status,
      statusText: response.statusText,
      redirected: response.redirected,
      bodyUsed: new ivm.Reference(() => response.bodyUsed),
      text: new ivm.Reference(() => response.text()),
      json: new ivm.Reference(() => response.json()),
      bytes: new ivm.Reference(() => response.arrayBuffer()),
      arrayBuffer: new ivm.Reference(() => response.arrayBuffer()),
      headers: Object.fromEntries(response.headers),
    }
  })
  await context.global.set('fetchImpl', reference)

  // --- The script will receive a URL and an init object as reference and call the
  // --- `fetchImpl` reference to get the wrapped response object. Then, it will unwrap
  // --- the properties of that object and re-wrap them to make them work as expected in the VM.
  const script = await isolate.compileScript(`
    const fetch = async(url, init) => {

      // Call the fetch function from the parent isolate.
      const responseRef = await fetchImpl.apply(undefined, [url, init], {
        arguments: { copy: true },
        result: { reference: true, promise: true },
      })

      // Return the response object with the wrapped methods.
      return {
        get ok() { return responseRef.getSync('ok') },
        get url() { return responseRef.getSync('url') },
        get type() { return responseRef.getSync('type') },
        get status() { return responseRef.getSync('status') },
        get statusText() { return responseRef.getSync('statusText') },
        get redirected() { return responseRef.getSync('redirected') },
        get body() { throw new Error('Not implemented') },
        get bodyUsed() { return responseRef.getSync('bodyUsed').applySync(undefined, []) },
        text: () => responseRef.getSync('text').apply(undefined, [], { result: { promise: true } }),
        json: () => responseRef.getSync('json').apply(undefined, [], { result: { promise: true } }),
        bytes: () => responseRef.getSync('bytes').apply(undefined, [], { result: { promise: true } }),
        arrayBuffer: () => responseRef.getSync('arrayBuffer').apply(undefined, [], { result: { promise: true } }),
        blob: () => { throw new Error('Not implemented') },
        clone: () => { throw new Error('Not implemented') },
        formData: () => { throw new Error('Not implemented') },
        get headers() {
          const headersObject = responseRef.getSync('headers').copySync()
          return new Headers(headersObject)
        },
      }
    }
  `, {})
  await script.run(context)
}

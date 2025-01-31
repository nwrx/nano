import type ivm from 'isolated-vm'

/**
 * Provides the ReadableStream class to the isolate.
 *
 * @param isolate The isolate to register the ReadableStream class in.
 * @param context The context to register the ReadableStream class in.
 */
export async function registerReadableStream(isolate: ivm.Isolate, context: ivm.Context): Promise<void> {
  const script = await isolate.compileScript(`
    class ReadableStream {
      constructor({ start } = {}) {
        this._chunks = [];
        this._closed = false;
        this._readRequests = [];

        const controller = {
          enqueue: (chunk) => {
            if (this._closed) {
              throw new Error('Cannot enqueue after stream is closed.');
            }
            // If there's a pending read request, resolve it immediately
            if (this._readRequests.length > 0) {
              const { resolve } = this._readRequests.shift();
              resolve({ value: chunk, done: false });
            } else {
              // Otherwise, store the chunk for future reads
              this._chunks.push(chunk);
            }
          },
          close: () => {
            if (this._closed) return;
            this._closed = true;
            // Resolve all pending readers with done: true
            while (this._readRequests.length > 0) {
              const { resolve } = this._readRequests.shift();
              resolve({ value: undefined, done: true });
            }
          },
        };

        if (typeof start === 'function') {
          try {
            start(controller);
          } catch (err) {
            // If start throws an error, we might consider the stream errored.
            // In a real ReadableStream, we'd need to handle this as an error state.
            // For now, we just close immediately.
            controller.close();
          }
        }
      }
      getReader() {
        return {
          read: () => {
            // If we already have a chunk queued, return it immediately
            if (this._chunks.length > 0) {
              const value = this._chunks.shift();
              return Promise.resolve({ value, done: false });
            }

            // If the stream is closed and no chunks remain, we're done
            if (this._closed) {
              return Promise.resolve({ value: undefined, done: true });
            }

            // Otherwise, we need to wait for data to arrive or the stream to close
            return new Promise((resolve) => {
              this._readRequests.push({ resolve });
            });
          },
        };
      }
    }
  `)
  await script.run(context)
}

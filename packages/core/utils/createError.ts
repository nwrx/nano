export interface ThreadErrorOptions {
  name: string
  message: string
  context?: Record<string, unknown>
}

export class ThreadError extends Error {
  name: string
  context: Record<string, unknown>
  constructor({ name, message, context }: ThreadErrorOptions) {
    super(message)
    this.name = name
    this.context = context ?? {}
  }
}

/**
 * Create a custom error object with the given options.
 *
 * @param options The options to create the error object.
 * @returns The error object created with the given options.
 * @example createError({ name: 'THREAD_ERROR', message: 'An error occurred in the thread.' })
 */
export function createError(options: ThreadErrorOptions): ThreadError {
  return new ThreadError(options)
}

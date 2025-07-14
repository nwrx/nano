export interface AIErrorOptions {
  name: string
  message: string
  context?: Record<string, unknown>
}

export class AIError extends Error {
  name: string
  context: Record<string, unknown>
  constructor({ name, message, context }: AIErrorOptions) {
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
 * @example createError({ name: 'E_AI_ERROR', message: 'An error occurred in the thread.' })
 */
export function createError(options: AIErrorOptions): AIError {
  return new AIError(options)
}

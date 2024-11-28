export interface FlowErrorOptions {
  name: string
  message: string
  context?: Record<string, unknown>
}

/**
 * An error instance that has additional properties for the error message.
 *
 * @param code The error code.
 * @param message The error message.
 * @param data The additional data for the error message.
 */
export class FlowError extends Error {
  name: string
  context: Record<string, unknown>

  constructor({ name, message, context }: FlowErrorOptions) {
    super(message)
    this.name = name
    this.context = context ?? {}
  }
}

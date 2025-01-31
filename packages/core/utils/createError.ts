export interface FlowErrorOptions {
  name: string
  message: string
  data?: Record<string, unknown>
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
  data: Record<string, unknown>

  constructor({ name, message, data }: FlowErrorOptions) {
    super(message)
    this.name = name
    this.data = data ?? {}
  }
}

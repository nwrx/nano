export interface FlowErrorOptions {
  code: string
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
  code: string
  data: Record<string, unknown>

  constructor({ code, message, data }: FlowErrorOptions) {
    super(message)
    this.code = code
    this.data = data ?? {}
  }
}

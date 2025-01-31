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

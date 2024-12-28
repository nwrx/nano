export type EmitterEvents = Record<string, any[]>

export class EmitterEventPayload<T extends any[] = any[]> extends Event {
  constructor(type: string, public payload: T) {
    super(type)
  }
}

/**
 * An event emitter that can be used to dispatch events and listen for them. The
 * emitter is used to create a custom event system that can be used to communicate
 * between different parts of the application.
 */
export class Emitter<T extends EmitterEvents> {

  /** The event target that is used to dispatch events. */
  private eventTarget = new EventTarget()

  /** The event handlers that are currently active. */
  private eventHandlers: Array<[keyof T & string, EventListener]> = []

  /**
   * Add a listener for the specified event. The listener will be called whenever
   * the event is dispatched. The listener receives the data that is passed to the
   * `dispatch` method as arguments.
   *
   * @param eventName The event to listen for.
   * @param listener The listener that is called when the event is dispatched.
   * @returns A function that can be called to remove the listener.
   * @example
   *
   * // Create a new emitter instance.
   * const emitter = new Emitter<{ 'click': [MouseEvent] }>()
   *
   * // Add a listener for the 'click' event.
   * emitter.on('click', (event) => { ... })
   *
   * // Dispatch the 'click' event with a MouseEvent.
   * emitter.dispatch('click', new MouseEvent('click'))
   */
  on<K extends keyof T & string>(eventName: K, listener: (...payload: T[K]) => any) {
    const handler = ((event: EmitterEventPayload) => { listener(...event.payload as T[K]) }) as EventListener
    this.eventTarget.addEventListener(eventName, handler)
    this.eventHandlers.push([eventName, handler])
    return () => this.eventTarget.removeEventListener(eventName, handler)
  }

  /**
   * Dispatch an event with the specified data. This will trigger all listeners
   * that are currently active for the event. The data is passed to the listener
   * as arguments.
   *
   * @param eventName The event to dispatch.
   * @param payload The payload that is passed to the listener.
   * @example
   *
   * // Create a new emitter instance.
   * const emitter = new Emitter<{ 'click': [MouseEvent] }>()
   *
   * // Add a listener for the 'click' event.
   * emitter.on('click', (event) => { ... })
   *
   * // Dispatch the 'click' event with a MouseEvent.
   * emitter.dispatch('click', new MouseEvent('click'))
   */
  dispatch<K extends keyof T & string>(eventName: K, ...payload: T[K]) {
    const event = new EmitterEventPayload(eventName, payload)
    this.eventTarget.dispatchEvent(event)
  }

  /**
   * Remove all event listeners that are currently active. This will prevent any
   * listeners from being called when the event is dispatched.
   */
  clearListeners() {
    for (const [event, handler] of this.eventHandlers)
      this.eventTarget.removeEventListener(event, handler)
    this.eventHandlers = []
  }

  /**
   * Remove all event listeners that are currently active. This will prevent any
   * listeners from being called when the event is dispatched.
   */
  [Symbol.dispose]() {
    this.clearListeners()
  }
}

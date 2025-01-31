export type EmitterEvents = Record<string, any[]>

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
   * @param event The event to listen for.
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
  on<K extends keyof T & string>(event: K, listener: (...data: T[K]) => any) {
    const handler = (event: Event) => listener(...(event as CustomEvent).detail as T[K]) as unknown
    this.eventTarget.addEventListener(event, handler)
    this.eventHandlers.push([event, handler])
    return () => this.eventTarget.removeEventListener(event, handler)
  }

  /**
   * Dispatch an event with the specified data. This will trigger all listeners
   * that are currently active for the event. The data is passed to the listener
   * as arguments.
   *
   * @param event The event to dispatch.
   * @param data The data to pass to the listener.
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
  dispatch<K extends keyof T>(event: K, ...data: T[K]) {
    const customEvent = new CustomEvent(event as string, { detail: data })
    this.eventTarget.dispatchEvent(customEvent)
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

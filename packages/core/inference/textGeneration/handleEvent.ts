import type { TextGeneration } from './types'
import { randomUUID } from 'node:crypto'

export function handleEvent(context: TextGeneration.Context, event: TextGeneration.Event): void {
  context.provider.dispatch('textGenerationEvent', event)

  if (event.type === 'finish') {
    context.isDone = event.finishReason !== 'tool-calls'
  }

  // --- Handle text events. First, store new text events in the queue and
  // --- append deltas to the existing parts. Once the text event ends, we
  // --- will push the final text message to the messages array.
  else if (event.type === 'text-start') {
    context.pendingMessages.set(event.id, { type: 'text', deltas: [] })
  }
  else if (event.type === 'text-delta') {
    const pending = context.pendingMessages.get(event.id)
    if (!pending) throw new Error(`Expected a pending text event with id "${event.id}"`)
    if (pending.type !== 'text') throw new Error(`Expected a pending text event with id "${event.id}" to be of type "text"`)
    pending.deltas.push(event.delta)
    context.controller.enqueue(event.delta)
  }
  else if (event.type === 'text-end') {
    const eventText = context.pendingMessages.get(event.id)
    if (!eventText) throw new Error(`Expected a pending text event with id "${event.id}"`)
    context.pendingMessages.delete(event.id)
    context.controller.enqueue('\n') // Ensure a newline after the text event
    context.messages.push({ role: 'assistant', content: [{ type: 'text', text: eventText.deltas.join('') }] })
  }

  // --- Handle tool call events. First, store new tool call events in the queue and
  // --- append deltas to the existing parts. Once the tool call event ends, we
  // --- will push the final tool call message to the messages array.
  else if (event.type === 'tool-input-start') {
    context.pendingMessages.set(event.id, {
      type: 'tool',
      toolName: event.toolName,
      toolCallId: event.toolCallId ?? randomUUID(),
      providerExecuted: event.providerExecuted,
      deltas: [],
    })
  }
  else if (event.type === 'tool-input-delta') {
    const pending = context.pendingMessages.get(event.id)
    if (!pending) throw new Error(`Expected a pending tool call event with id "${event.id}"`)
    pending.deltas.push(event.delta)
  }
  else if (event.type === 'tool-input-end') {
    const eventToolCall = context.pendingMessages.get(event.id)
    if (!eventToolCall) throw new Error(`Expected a pending tool call event with id "${event.id}"`)
    if (eventToolCall.type !== 'tool') throw new Error(`Expected a pending tool call event with id "${event.id}" to be of type "tool"`)
    context.pendingMessages.delete(event.id)
    const contentToolCall: TextGeneration.ContentToolCall = {
      type: 'tool-call',
      input: JSON.parse(eventToolCall.deltas.join('')),
      toolName: eventToolCall.toolName,
      toolCallId: eventToolCall.toolCallId,
      providerExecuted: eventToolCall.providerExecuted,
    }

    if (eventToolCall.providerExecuted)
      context.messages.push({ role: 'assistant', content: [contentToolCall] })
    else context.pendingToolCalls.push(contentToolCall)
  }

  // --- Handle remote tool results and push them to the messages array.
  else if (event.type === 'tool-result') {
    context.messages.push({
      role: 'assistant',
      content: [{
        type: 'tool-result',
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        output: event.output,
      }],
    })
  }
}

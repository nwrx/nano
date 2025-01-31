import { INFERENCE_ERRORS as E } from './errors'
import { handleResponseMessageDelta } from './handleResponseMessageDelta'

describe('handleResponseMessageDelta', () => {
  it('should append message content to the last message in the context', () => {
    const messages = [{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Hi' }]
    // @ts-expect-error: mock context
    handleResponseMessageDelta({ messages }, { role: 'assistant', content: ' there!' })
    expect(messages).toStrictEqual([
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ])
  })

  it('should throw an error if the last message is missing', () => {
    // @ts-expect-error: mock context
    const shouldThrow = () => handleResponseMessageDelta({ messages: [] }, { role: 'assistant', content: ' there!' })
    const error = E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_LAST_MESSAGE()
    expect(shouldThrow).toThrowError(error)
  })

  it('should throw an error if the last message is not from the assistant', () => {
    // @ts-expect-error: mock context
    const shouldThrow = () => handleResponseMessageDelta({ messages: [{ role: 'user', content: 'Hello' }] }, { role: 'assistant', content: ' there!' })
    const error = E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_LAST_MESSAGE_NOT_ASSISTANT()
    expect(shouldThrow).toThrowError(error)
  })

  it('should throw an error if the message is not from the assistant', () => {
    // @ts-expect-error: mock context
    const shouldThrow = () => handleResponseMessageDelta({ messages: [{ role: 'assistant', content: 'Hi' }] }, { role: 'user', content: 'Hello' })
    const error = E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MESSAGE_NOT_ASSISTANT()
    expect(shouldThrow).toThrowError(error)
  })

  it('should throw an error if the last message content is missing', () => {
    // @ts-expect-error: mock context
    const shouldThrow = () => handleResponseMessageDelta({ messages: [{ role: 'assistant' }] }, { role: 'assistant', content: ' there!' })
    const error = E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_LAST_MESSAGE_CONTENT()
    expect(shouldThrow).toThrowError(error)
  })

  it('should throw an error if the message content is missing', () => {
    // @ts-expect-error: mock context
    const shouldThrow = () => handleResponseMessageDelta({ messages: [{ role: 'assistant', content: 'Hi' }] }, { role: 'assistant' })
    const error = E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_MESSAGE_CONTENT()
    expect(shouldThrow).toThrowError(error)
  })
})

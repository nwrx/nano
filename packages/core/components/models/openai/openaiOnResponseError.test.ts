import { createError } from '../../../utils'
import { openaiOnResponseError } from './openaiOnResponseError'

export function createResponse(status: number, statusText: string, text: string) {
  return {
    status,
    statusText,
    text: () => Promise.resolve(text),
  } as unknown as Response
}

describe('openaiOnResponseError', () => {
  describe('with default provider', () => {
    it('should throw an error with the extracted message from JSON response', async() => {
      const response = createResponse(400, 'Bad Request', '{"error": {"message": "Invalid request"}}')
      const shouldReject = openaiOnResponseError(response)
      const error = createError({
        name: 'E_OPENAI_BAD_REQUEST',
        message: 'Invalid request',
        context: { statusText: 'Bad Request', status: 400 },
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error with the status text if response text is empty', async() => {
      const response = createResponse(404, 'Not Found', '')
      const shouldReject = openaiOnResponseError(response)
      const error = createError({
        name: 'E_OPENAI_NOT_FOUND',
        message: 'Not Found',
        context: { statusText: 'Not Found', status: 404 },
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error with the response text if it is not JSON', async() => {
      const response = createResponse(500, 'Internal Server Error', 'Server error occurred')
      const shouldReject = openaiOnResponseError(response)
      const error = createError({
        name: 'E_OPENAI_INTERNAL_SERVER_ERROR',
        message: 'Server error occurred',
        context: { statusText: 'Internal Server Error', status: 500 },
      })
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('with custom provider', () => {
    it('should throw an error with the extracted message from JSON response', async() => {
      const response = createResponse(400, 'Bad Request', '{"error": {"message": "Invalid request"}}')
      const shouldReject = openaiOnResponseError(response, 'custom')
      const error = createError({
        name: 'E_CUSTOM_BAD_REQUEST',
        message: 'Invalid request',
        context: { statusText: 'Bad Request', status: 400 },
      })
      await expect(shouldReject).rejects.toThrowError(error)
    })

    it('should throw an error with the status text if response text is empty', async() => {
      const response = createResponse(404, 'Not Found', '')
      const shouldReject = openaiOnResponseError(response, 'custom')
      const error = createError({
        name: 'E_CUSTOM_NOT_FOUND',
        message: 'Not Found',
        context: { statusText: 'Not Found', status: 404 },
      })
      await expect(shouldReject).rejects.toThrowError(error)
    })

    it('should throw an error with the response text if it is not JSON', async() => {
      const response = createResponse(500, 'Internal Server Error', 'Server error occurred')
      const shouldReject = openaiOnResponseError(response, 'custom')
      const error = createError({
        name: 'E_CUSTOM_INTERNAL_SERVER_ERROR',
        message: 'Server error occurred',
        context: { statusText: 'Internal Server Error', status: 500 },
      })
      await expect(shouldReject).rejects.toThrowError(error)
    })
  })
})

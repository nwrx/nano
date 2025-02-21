import { toConstantCase } from '@unshared/string'
import { createError } from '../../../utils'

export const ANTHROPIC_ERRORS = {
  RESPONSE_CONTEXT_WINDOW_OVERFLOW: (provider = 'anthropic') => createError({
    name: toConstantCase('e', provider, 'RESPONSE_CONTEXT_WINDOW_OVERFLOW'),
    message: 'The completion context window overflowed.',
  }),
  RESPONSE_MISSING_CONTENT_TYPE: (provider = 'anthropic') => createError({
    name: toConstantCase('e', provider, 'MISSING_CONTENT_TYPE'),
    message: 'The response is missing the Content-Type header.',
  }),
}

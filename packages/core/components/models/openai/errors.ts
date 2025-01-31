import { toConstantCase } from '@unshared/string'
import { createError } from '../../../utils'

export const OPENAI_ERRORS = {
  RESPONSE_CONTENT_FILTER: (provider = 'openai', refusal?: string) => createError({
    name: toConstantCase('e', provider, 'RESPONSE_CONTENT_FILTER'),
    message: 'The completion was stopped due to content filtering.',
    context: { refusal },
  }),
  RESPONSE_CONTEXT_WINDOW_OVERFLOW: (provider = 'openai') => createError({
    name: toConstantCase('e', provider, 'RESPONSE_CONTEXT_WINDOW_OVERFLOW'),
    message: 'The completion context window overflowed.',
  }),
  RESPONSE_MISSING_CONTENT_TYPE: (provider = 'openai') => createError({
    name: toConstantCase('e', provider, 'MISSING_CONTENT_TYPE'),
    message: 'The response is missing the Content-Type header.',
  }),
}

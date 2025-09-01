/* eslint-disable n/no-process-exit */
/* eslint-disable unicorn/no-process-exit */
import { AssertionError } from '@unshared/validation'

const RED = (text: string) => `\u001B[31m${text}\u001B[0m`
const YELLOW = (text: string) => `\u001B[33m${text}\u001B[0m`

/**
 * Handle assertion errors thrown by the validation library.
 *
 * @param error The error to handle.
 */
export function handleAssertionError(error: unknown): void {
  if (error instanceof AssertionError === false) throw error
  const { name, context } = error
  if (name !== 'E_RULE_MAP_ASSERTION_FAILED') throw error

  // --- Compile the message of each error of the `E_RULE_MAP_ASSERTION_FAILED` error.
  const messages: string[] = []
  const errors = context as Record<string, AssertionError> | undefined
  if (!errors) throw error

  for (const [path, error] of Object.entries(errors)) {
    if (error instanceof Error === false) continue
    const { name, message, context } = error

    // --- If the error is not a rule set assertion error, add it to the messages.
    if (name !== 'E_RULE_SET_ASSERTION_FAILED') {
      messages.push(`${YELLOW(path)}:\n  ${RED(name)}: ${message}`)
      continue
    }

    // --- If the error is a rule set assertion error, add each of its errors to the messages.
    const subMessages: string[] = []
    const causes = context.causes as Record<string, AssertionError> | undefined
    if (!causes) continue
    for (const cause of Object.values(causes)) {
      if (cause instanceof Error === false) continue
      if (cause.name === 'E_NOT_UNDEFINED') continue
      const { name: subName, message: subMessage } = cause
      subMessages.push(`${RED(subName)}: ${subMessage}`)
    }

    const subMessageHeader = YELLOW(path)
    const subMessage = [subMessageHeader, ...subMessages].join('\n  ')
    messages.push(subMessage)
  }

  const finalMessage = `The following environment variables are invalid:\n\n${messages.join('\n\n')}`
  console.error(finalMessage)
  process.exit(1)
}

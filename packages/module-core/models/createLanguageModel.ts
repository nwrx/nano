import type { LanguageModel } from './languageModel'

/**
 * Creates a language model instance.
 *
 * @param languageModel The configuration of the language model.
 * @returns The type-safe language model instance.
 */
export function createLanguageModel<T, U>(languageModel: LanguageModel<T, U>): LanguageModel<T, U> {
  return languageModel
}

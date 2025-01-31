import { sample } from '@unshared/collection'

const NOUNS = [
  'apple',
  'banana',
  'cherry',
  'date',
  'elderberry',
  'fig',
  'grape',
  'honeydew',
  'kiwi',
  'lemon',
  'mango',
  'nectarine',
  'orange',
  'pear',
  'quince',
  'raspberry',
  'strawberry',
  'tangerine',
  'watermelon',
]

const ADJECTIVES = [
  'adorable',
  'beautiful',
  'clean',
  'drab',
  'elegant',
  'fancy',
  'glamorous',
  'handsome',
  'long',
  'magnificent',
  'old-fashioned',
  'plain',
  'quaint',
  'sparkling',
  'ugliest',
  'unsightly',
  'wide-eyed',
]

/**
 * Generate a random name.
 *
 * @returns A random name.
 */
export function randomName() {
  const adjective = sample(ADJECTIVES)
  const noun = sample(NOUNS)
  return `${adjective}-${noun}`
}

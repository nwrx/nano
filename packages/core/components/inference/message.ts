import { defineComponent } from '../../utils/defineComponent'
import { languageModelMessageSchema } from './utils/languageModelMessageSchema'

export const message = defineComponent(
  {
    inputs: {
      role: {
        title: 'Role',
        description: 'The role of the message.',
        ...languageModelMessageSchema.oneOf[0].properties.role,
      },
      content: {
        title: 'Content',
        description: 'The content of the message.',
        ...languageModelMessageSchema.oneOf[0].properties.content,
      },
    },
    outputs: {
      message: languageModelMessageSchema,
    },
  },
  ({ data }) => ({
    message: {
      role: data.role,
      content: data.content,
    },
  }),
)

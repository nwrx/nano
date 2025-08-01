import { defineComponent } from '../utils/defineComponent'

export const message = defineComponent(
  {
    name: 'message',
    purpose: 'processing',
    icon: 'carbon:chat',
    title: {
      en: 'Message',
      fr: 'Message',
      de: 'Nachricht',
      es: 'Mensaje',
      zh: '消息',
    },
    description: {
      en: 'Create chat messages with roles (user, assistant, system, tool) and content.',
      fr: 'Créer des messages de chat avec des rôles (utilisateur, assistant, système, outil) et du contenu.',
      de: 'Chat-Nachrichten mit Rollen (Benutzer, Assistent, System, Tool) und Inhalt erstellen.',
      es: 'Crear mensajes de chat con roles (usuario, asistente, sistema, herramienta) y contenido.',
      zh: '创建具有角色（用户、助手、系统、工具）和内容的聊天消息。',
    },
    inputs: {
      role: {
        'title': 'Role',
        'description': 'The role of the message.',
        'type': 'string',
        'enum': [
          'user',
          'assistant',
          'system',
          'tool',
        ],
        'x-enum-labels': [
          'User',
          'Assistant',
          'System',
          'Tool',
        ],
        'x-enum-icons': [
          'i-mdi-account',
          'i-mdi-robot',
          'i-mdi-shield-account',
          'i-mdi-cog',
        ],
      },
      content: {
        title: 'Content',
        description: 'The content of the message.',
        type: 'array',
        items: {
          oneOf: [
            { type: 'string' },
            { type: 'boolean' },
            { type: 'number' },
            { 'x-type': 'file' },
          ],
        },
      },
    },
    outputs: {
      message: {
        type: 'object',
        additionalProperties: true,
      },
    },
  },
  ({ data }) => ({
    message: {
      role: data.role,
      content: data.content,
    },
  }),
)

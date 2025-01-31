import type { JSONSchema4 } from 'json-schema'
import { defineNode, FlowError } from '@nwrx/core'
import { categoryLanguageModelTool } from '@nwrx/module-core/categories'
import { languageModelTool, string } from '@nwrx/module-core/types'
import { google } from 'googleapis'

export interface GoogleDriveGetToolInput {
  fileId: string
  fields?: string
}

export const nodeGoogleDriveGetTool = defineNode({
  kind: 'google/drive/get',
  name: 'Google Drive Get',
  icon: 'https://api.iconify.design/logos:google-drive.svg',
  description: 'Retrieves a file from Google Drive based on the file ID.',
  category: categoryLanguageModelTool,

  inputSchema: {
    credentials: {
      name: 'Credentials',
      type: string,
      control: 'variable',
      description: 'The ID of the file to retrieve from Google Drive. You can find the file ID in the file\'s URL or through a search query',
      isOptional: false,
    },
    name: {
      name: 'Name',
      type: string,
      control: 'text',
      description: 'Override the internal name used when passing the tool to the Language Model.',
      defaultValue: 'google_drive_get',
      isOptional: true,
    },
    description: {
      name: 'Description',
      type: string,
      control: 'textarea',
      description: 'The description of the tool.',
      defaultValue: 'Given a file ID, fetch the file from Google Drive.',
      isOptional: true,
    },
  },

  outputSchema: {
    tool: {
      name: 'Tool',
      type: languageModelTool,
      description: 'The file retrieved from Google Drive.',
    },
  },

  process: ({ input }) => ({
    tool: {
      name: input.name!,
      description: input.description!,
      schema: {
        type: 'object',
        required: ['fileId'],
        properties: {
          fileId: {
            type: 'string',
            description: 'The ID of the file to retrieve from Google Drive.',
          },
          fields: {
            type: 'string',
            description: 'The fields to include in the response.',
            default: 'id, name, mimeType, size, modifiedTime',
          },
        },
      } as JSONSchema4,
      call: async(data) => {
        try {
          const { credentials } = input
          const { fileId, fields } = data as unknown as GoogleDriveGetToolInput
          const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/drive'],
            credentials: JSON.parse(credentials) as object,
          })
          const service = google.drive({ version: 'v3', auth })
          const file = await service.files.get({ fileId, fields })
          return JSON.stringify(file.data, undefined, 2)
        }
        catch (error) {
          const message = (error as Error).message
          throw new FlowError({
            name: 'GOOGLE_DRIVE_GET_ERROR',
            message: `An error occurred while retrieving the file from Google Drive: ${message}`,
            data,
          })
        }
      },
    },
  }),
})

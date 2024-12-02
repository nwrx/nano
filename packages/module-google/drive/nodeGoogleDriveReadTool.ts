import type { JSONSchema4 } from 'json-schema'
import { defineComponent, ThreadError } from '@nwrx/core'
import { languageModelTool, string } from '@nwrx/module-core/types'
import { google } from 'googleapis'
import { categoryGoogleDrive } from '../categories'

export interface GoogleDriveDownloadToolInput {
  fileId: string
}

export const nodeGoogleDriveDownloadTool = defineComponent({
  kind: 'google/drive-read-tool',
  name: 'Google Drive - Read Tool',
  icon: 'https://api.iconify.design/logos:google-drive.svg',
  description: 'Downloads a file from Google Drive based on the file ID.',
  category: categoryGoogleDrive,

  inputSchema: {
    credentials: {
      name: 'Credentials',
      type: string,
      control: 'variable',
      description: 'The credentials to authenticate with Google Drive.',
      isOptional: false,
    },
    name: {
      name: 'Name',
      type: string,
      control: 'text',
      description: 'Override the internal name used when passing the tool to the Language Model.',
      defaultValue: 'google_drive_read',
      isOptional: true,
    },
    description: {
      name: 'Description',
      type: string,
      control: 'textarea',
      description: 'The description of the tool.',
      defaultValue: 'Given a file ID, download the file from Google Drive.',
      isOptional: true,
    },
  },

  outputSchema: {
    tool: {
      name: 'Tool',
      type: languageModelTool,
      description: 'The file downloaded from Google Drive.',
    },
  },

  process: ({ data }) => ({
    tool: {
      name: input.name!,
      description: input.description!,
      schema: {
        type: 'object',
        required: ['fileId'],
        properties: {
          fileId: {
            type: 'string',
            description: 'The ID of the file to download from Google Drive.',
          },
        },
      } as JSONSchema4,
      call: async(data) => {
        try {
          const { credentials } = input
          const { fileId } = data as unknown as GoogleDriveDownloadToolInput
          const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/drive'],
            credentials: JSON.parse(credentials) as object,
          })
          const service = google.drive({ version: 'v3', auth })
          const response = await service.files.get({ fileId, alt: 'media' }, { responseType: 'stream' } )
          return new Promise<string>((resolve) => {
            const chunks: Buffer[] = []
            response.data.on('data', chunk => chunks.push(chunk as Buffer))
            response.data.on('end', () => {
              const fileBuffer = Buffer.concat(chunks)
              resolve(fileBuffer.toString('base64'))
            })
          })
        }
        catch (error) {
          const message = (error as Error).message
          throw new ThreadError({
            name: 'GOOGLE_DRIVE_DOWNLOAD_ERROR',
            message: `An error occurred while downloading the file from Google Drive: ${message}`,
            data,
          })
        }
      },
    },
  }),
})

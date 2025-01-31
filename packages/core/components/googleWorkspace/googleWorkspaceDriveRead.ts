import { defineComponent, ThreadError } from '@nwrx/core'
import { file, object, string } from '@nwrx/module-core/types'
import { google } from 'googleapis'
import { ReadableStream } from 'node:stream/web'
import { categoryGoogleDrive } from '../categories'

export interface GoogleDriveGetInput {
  fileId: string
  fields?: string
}

export const nodeGoogleDriveGet = defineComponent({
  kind: 'google/drive-read',
  name: 'Google Drive - Read',
  icon: 'https://api.iconify.design/logos:google-drive.svg',
  description: 'Retrieves a file from Google Drive based on the file ID.',
  category: categoryGoogleDrive,

  inputs: {
    credentials: {
      name: 'Credentials',
      type: object,
      control: 'variable',
      description: 'The credentials to authenticate with Google Drive.',
      isOptional: false,
    },
    fileId: {
      name: 'File ID',
      type: string,
      control: 'select',
      description: 'The ID of the file to retrieve from Google Drive.',
      isOptional: false,
      options: async({ credentials }, query) => {
        const auth = new google.auth.GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/drive'],
          credentials: credentials as object,
        })
        const service = google.drive({ version: 'v3', auth })
        const response = await service.files.list({
          q: `name contains '${query}' and mimeType != 'application/vnd.google-apps.folder'`,
          fields: 'files(id, name, mimeType)',
          pageSize: 10,
        })
        return response.data.files!.map(file => ({
          value: file.id!,
          label: file.name!,
          description: file.mimeType!,
          icon: 'https://api.iconify.design/mdi:google-drive.svg',
        }))
      },
    },
  },

  outputs: {
    file: {
      name: 'File',
      type: file,
      description: 'The file retrieved from Google Drive.',
    },
  },

  process: async({ data }) => {
    try {
      const { credentials, fileId } = input
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive'],
        credentials,
      })
      const service = google.drive({ version: 'v3', auth })
      const file = await service.files.get({
        fileId,
        fields: 'id, name, mimeType, size, webViewLink',
      })
      const getStream = async() => {
        const stream = await service.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })
        return ReadableStream.from(stream.data)
      }

      return {
        file: {
          id: file.data.id!,
          name: file.data.name!,
          type: file.data.mimeType!,
          getUrl: () => file.data.webViewLink!,
          getLength: () => Number(file.data.size),
          getStream,
        },
      }
    }
    catch (error) {
      const message = (error as Error).message
      throw new ThreadError({
        name: 'GOOGLE_DRIVE_GET_ERROR',
        message: `An error occurred while retrieving the file from Google Drive: ${message}`,
      })
    }
  },
})

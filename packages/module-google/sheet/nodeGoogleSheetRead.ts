import type { Type } from '@nwrx/core'
import { defineNode, FlowError } from '@nwrx/core'
import { object, string } from '@nwrx/module-core/types'
import { google } from 'googleapis'
import { categoryGoogleSheet } from '../categories/categoryGoogleSheet'

export interface GoogleSheetReadInput {
  spreadsheetId: string
  range: string
  credentials: string
}

export const nodeGoogleSheetRead = defineNode({
  kind: 'google/sheet-read',
  name: 'Google Sheet - Read',
  icon: 'https://api.iconify.design/mdi:spreadsheet.svg',
  description: 'Reads data from a Google Sheets file and returns it as an array of objects.',
  category: categoryGoogleSheet,

  inputSchema: {
    credentials: {
      name: 'Credentials',
      type: string,
      control: 'variable',
      description: 'The credentials to authenticate with Google Sheets.',
    },
    spreadsheetId: {
      name: 'Spreadsheet ID',
      type: string,
      control: 'select',
      description: 'The ID of the Google Sheets file to read from.',
      options: async({ credentials }, query) => {
        const auth = new google.auth.GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/drive'],
          credentials: JSON.parse(credentials as string) as object,
        })

        const service = google.drive({ version: 'v3', auth })
        const response = await service.files.list({
          q: `mimeType = 'application/vnd.google-apps.spreadsheet' and name contains '${query}'`,
          fields: 'files(id, name)',
          pageSize: 10,
        })

        return response.data.files!.map(file => ({
          value: file.id!,
          label: file.name!,
          icon: 'https://api.iconify.design/mdi:spreadsheet.svg',
        }))
      },
    },
    sheet: {
      name: 'Sheet',
      type: string,
      control: 'select',
      description: 'The name of the sheet to read from the Google Sheets file.',
      isOptional: true,
      options: async({ credentials, spreadsheetId }) => {
        if (!spreadsheetId) return []
        const auth = new google.auth.GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
          credentials: JSON.parse(credentials as string) as object,
        })
        const sheets = google.sheets({ version: 'v4', auth })
        const response = await sheets.spreadsheets.get({ spreadsheetId: spreadsheetId as string })
        return response.data.sheets!.map(sheet => ({
          value: sheet.properties!.title!,
          label: sheet.properties!.title!,
          icon: 'https://api.iconify.design/mdi:spreadsheet.svg',
        }))
      },
    },
    range: {
      name: 'Range',
      type: string,
      control: 'text',
      description: 'The range of cells to read from the Google Sheets file (e.g., "A1:D10").',
      defaultValue: 'A1:Z1000',
      isOptional: true,
    },
  },

  outputSchema: {
    rows: {
      name: 'Rows',
      type: object as Type<object>,
      description: 'The rows of data read from the Google Sheets file.',
    },
  },

  process: async({ input }) => {
    try {
      const { credentials, spreadsheetId, sheet, range } = input
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        credentials: JSON.parse(credentials) as object,
      })
      const sheets = google.sheets({ version: 'v4', auth })
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        valueRenderOption: 'UNFORMATTED_VALUE',
        range: `${sheet}!${range}`,
      })
      const rows = response.data.values

      if (!rows || rows.length === 0) {
        throw new FlowError({
          name: 'GOOGLE_SHEET_NO_DATA',
          message: 'No data found in the specified range.',
        })
      }

      return { rows }
    }
    catch (error) {
      const message = (error as Error).message
      throw new FlowError({
        name: 'GOOGLE_SHEET_READ_ERROR',
        message: `An error occurred while reading data from Google Sheets: ${message}`,
      })
    }
  },
})

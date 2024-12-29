import { google } from 'googleapis'
import { defineComponent } from '../../utils'

export interface GoogleSheetReadInput {
  spreadsheetId: string
  range: string
  credentials: string
}

export const googleSheetRead = defineComponent(
  {
    title: 'Google Sheet - Read',
    icon: 'https://api.iconify.design/mdi:spreadsheet.svg',
    description: 'Reads data from a Google Sheets file and returns it as an array of objects.',
    inputs: {
      credentials: {
        type: 'string',
        name: 'Credentials',
        control: 'variable',
        description: 'The credentials to authenticate with Google Sheets.',
      },
      spreadsheetId: {
        'type': 'string',
        'name': 'Spreadsheet ID',
        'control': 'select',
        'description': 'The ID of the Google Sheets file to read from.',
        'x-options': async(data, query) => {
          const { credentials } = data as { credentials: string }
          const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/drive'],
            credentials: JSON.parse(credentials) as object,
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
        type: 'string',
        control: 'select',
        description: 'The name of the sheet to read from the Google Sheets file.',
        isOptional: true,
        options: async(data) => {
          const { credentials, spreadsheetId } = data as { credentials: string; spreadsheetId: string }
          if (!spreadsheetId) return []
          const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            credentials: JSON.parse(credentials) as object,
          })
          const sheets = google.sheets({ version: 'v4', auth })
          const response = await sheets.spreadsheets.get({ spreadsheetId })
          return response.data.sheets!.map(sheet => ({
            value: sheet.properties!.title!,
            label: sheet.properties!.title!,
            icon: 'https://api.iconify.design/mdi:spreadsheet.svg',
          }))
        },
      },
      range: {
        type: 'string',
        name: 'Range',
        control: 'text',
        description: 'The range of cells to read from the Google Sheets file (e.g., "A1:D10").',
        defaultValue: 'A1:Z1000',
        isOptional: true,
      },
    },

    outputs: {
      rows: {
        name: 'Rows',
        type: object as Type<object>,
        description: 'The rows of data read from the Google Sheets file.',
      },
    },
  },
  async({ data }) => {
    try {
      const { credentials, spreadsheetId, sheet, range } = data
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
        throw new ThreadError({
          name: 'GOOGLE_SHEET_NO_DATA',
          message: 'No data found in the specified range.',
        })
      }

      return { rows }
    }
    catch (error) {
      const message = (error as Error).message
      throw new ThreadError({
        name: 'GOOGLE_SHEET_READ_ERROR',
        message: `An error occurred while reading data from Google Sheets: ${message}`,
      })
    }
  },
)

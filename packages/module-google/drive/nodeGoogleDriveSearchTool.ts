import type { JSONSchema4 } from 'json-schema'
import { defineNode, FlowError } from '@nwrx/core'
import { categoryLanguageModelTool } from '@nwrx/module-core/categories'
import { languageModelTool, string } from '@nwrx/module-core/types'
import { dedent } from '@unshared/string'
import { google } from 'googleapis'

export interface GoogleDriveSearchToolInput {
  q: string
  fields?: string
  spaces?: string
}

const QUERY_STRING_DESCRIPTION = dedent(`
  You must also escape special characters in your file names to make sure the query works correctly. For example, if a filename
  contains both an apostrophe (') and a backslash ("\\") character, use a backslash to escape them: name contains 'quinn's paper\\essay'.

  Files with the name "hello": name = 'hello'
  Files with a name containing the words "hello" and "goodbye" name contains 'hello' and name contains 'goodbye'
  Files with a name that does not contain the word "hello" not name contains 'hello'
  Files that contain the text "important" and in the trash fullText contains 'important' and trashed = true
  Files that contain the word "hello" fullText contains 'hello'
  Files that don't have the word "hello" not fullText contains 'hello'
  Files that contain the exact phrase "hello world" fullText contains '"hello world"'
  Files with a query that contains the "\\" character (for example, "\\authors") fullText contains '\\authors'
  Files that are folders mimeType = 'application/vnd.google-apps.folder'
  Files that are not folders mimeType != 'application/vnd.google-apps.folder'
  Files modified after a given date (default time zone is UTC) modifiedTime > '2012-06-04T12:00:00'
  Image or video files modified after a specific date modifiedTime > '2012-06-04T12:00:00' and (mimeType contains 'image/' or mimeType contains 'video/')
  Files that are starred starred = true
  Files within a collection (for example, the folder ID in the parents collection) '1234567' in parents
  Files in an application data folder in a collection 'appDataFolder' in parents
  Files for which user "test@example.org" is the owner 'test@example.org' in owners
  Files for which user "test@example.org" has write permission 'test@example.org' in writers
  Files for which members of the group "group@example.org" have write permission 'group@example.org' in writers
  Files shared with the authorized user with "hello" in the name sharedWithMe and name contains 'hello'
  Files with a custom file property visible to all apps properties has { key='mass' and value='1.3kg' }
  Files with a custom file property private to the requesting app appProperties has { key='additionalID' and value='8e8aceg2af2ge72e78' }
  Files that have not been shared with anyone or domains (only private, or shared with specific users or groups) visibility = 'limited'
`)

export const nodeGoogleDriveSearchTool = defineNode({
  kind: 'google/drive/search',
  name: 'Google Drive Search',
  icon: 'https://api.iconify.design/logos:google-drive.svg',
  description: 'Searches for files in Google Drive based on specified query parameters.',
  category: categoryLanguageModelTool,

  inputSchema: {
    credentials: {
      name: 'Credentials',
      type: string,
      control: 'variable',
      description: QUERY_STRING_DESCRIPTION,
      isOptional: false,
    },
    name: {
      name: 'Name',
      type: string,
      control: 'text',
      description: 'Override the internal name used when passing the tool to the Language Model.',
      defaultValue: 'google_drive_search',
      isOptional: true,
    },
    description: {
      name: 'Description',
      type: string,
      control: 'textarea',
      description: 'The description of the tool.',
      defaultValue: 'Given a query, fetch files from Google Drive matching the query.',
      isOptional: true,
    },
  },

  outputSchema: {
    tool: {
      name: 'Tool',
      type: languageModelTool,
      description: 'A list of files matching the search query.',
    },
  },

  process: ({ input }) => ({
    tool: {
      name: input.name ?? 'query_google_drive_files',
      description: input.description ?? 'Given a query, fetch files from Google Drive matching the query.',
      schema: {
        type: 'object',
        required: ['q'],
        properties: {
          q: {
            type: 'string',
            description: 'The query string to filter the files in Google Drive.',
          },
          spaces: {
            type: 'string',
            description: 'A comma-separated list of spaces to query within the corpora. Supported values are \'drive\' and \'appDataFolder\'.',
            default: 'drive',
          },
          fields: {
            type: 'string',
            description: 'The fields to include in the response.',
            default: 'nextPageToken, files(id, name)',
          },
          pageSize: {
            type: 'integer',
            description: 'The maximum number of files to return per page.',
            default: 10,
          },
        },
      } as JSONSchema4,
      call: async(data) => {
        try {
          const { credentials } = input
          const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/drive'],
            credentials: JSON.parse(credentials) as object,
          })
          const service = google.drive({ version: 'v3', auth })
          const fileList = await service.files.list({
            q: data.q as string,
            fields: data.fields as string,
            pageSize: data.pageSize as number,
            spaces: 'drive',
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            supportsTeamDrives: true,
          })
          return JSON.stringify(fileList.data.files, undefined, 2)
        }
        catch (error) {
          const message = (error as Error).message
          throw new FlowError({
            name: 'GOOGLE_DRIVE_SEARCH_ERROR',
            message: `An error occurred while searching for files in Google Drive: ${message}`,
            data,
          })
        }
      },
    },
  }),
})

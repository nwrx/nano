export interface IconCollectionDownload {
  prefix: string
  icons: Record<string, { body: string }>
  width?: number
  height?: number
}

export namespace ImportTaskMessage {
  export interface Start {
    event: 'start'
  }
  export interface Done {
    event: 'done'
  }

  export interface FetchMetadataStart {
    event: 'fetchMetadataStart'
  }

  export interface FetchMetadataEnd {
    event: 'fetchMetadataEnd'
  }

  export interface FetchDownloadStart {
    event: 'fetchDownloadStart'
  }

  export interface FetchDownloadEnd {
    event: 'fetchDownloadEnd'
  }

  export interface UploadIcon {
    event: 'uploadIcon'
    name: string
  }
}

export type ImportTaskEvent =
  | ImportTaskMessage.Done
  | ImportTaskMessage.FetchDownloadEnd
  | ImportTaskMessage.FetchDownloadStart
  | ImportTaskMessage.FetchMetadataEnd
  | ImportTaskMessage.FetchMetadataStart
  | ImportTaskMessage.Start
  | ImportTaskMessage.UploadIcon

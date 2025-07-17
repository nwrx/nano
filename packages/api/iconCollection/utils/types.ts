export interface IconCollectionDownload {
  prefix: string
  icons: Record<string, { body: string }>
  width?: number
  height?: number
}

export interface VersionInfo {
  update: boolean
  version: string
  newVersion?: string
}

export interface UpdateErrorPayload {
  message: string
  error: Error
}

export interface Notification {
  Id: string
  Name: string
  Content: string
  CreatedDate: Date
  Type: 'INFORMATION' | 'WARNING'
  Status: 'NOT_SEEN_YET' | 'SEEN'
  Image: string
}

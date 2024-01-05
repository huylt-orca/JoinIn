
export interface ApplicationRequest {
  Id?: string
  CreatedDate?: Date
  Status?: 'WAITING' | 'APPROVED' | 'DISAPPROVED'
  ConfirmedDate?: Date
  Description?: string
  UserIds?: string[]
  GroupId?: string
  MajorIds?: string[]
}

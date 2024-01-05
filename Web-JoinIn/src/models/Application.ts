import { ApplicationMajor } from './ApplicationMajor'
import { Group } from './Group'
import { User } from './User'

export interface Application {
  Id: string
  CreatedDate: Date
  Status: 'WAITING' | 'APPROVED' | 'DISAPPROVED'
  ConfirmedDate: Date
  Description: string
  UserId: string
  GroupId: string
  User: User
  Group: Group
  ApplicationMajors: ApplicationMajor[]
}

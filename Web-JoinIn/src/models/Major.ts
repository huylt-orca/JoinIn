import { GroupMajor, UserMajor, ApplicationMajor } from './index'

export interface Major {
  Id: string
  Name: string
  ApplicationMajors: ApplicationMajor[]
  GroupMajors: GroupMajor[]
  UserMajors: UserMajor[]
}

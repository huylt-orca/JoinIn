import { Application } from '.'
import { Feedback } from './Feedback'
import { Member } from './Member'
import { Transaction } from './Transaction'
import { UserMajor } from './UserMajor'

export interface User {
  Id?: string
  FullName?: string
  Password?: string
  Email?: string
  Phone?: string
  BirthDay?: Date
  Gender?: boolean
  Description?: string
  Skill?: string
  OtherContact?: string
  Avatar?: string
  Theme?: string
  Status?: 'ACTIVE' | 'INACTIVE'
  IsAdmin?: boolean
  ReceivedFeedbacks?: Feedback[]
  SentFeedbacks?: Feedback[]
  Transactions?: Transaction[]
  UserMajors?: UserMajor[]
  Members?: Member[]
  Applications?: Application[]
}

import { Major } from '.'
import { User } from './User'

export interface UserMajor {
  UserId: string
  MajorId: string
  User: User
  Major: Major
}

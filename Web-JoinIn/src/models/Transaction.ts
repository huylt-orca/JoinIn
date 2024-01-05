import { User } from './User'

export interface Transaction {
  Id: string
  TransactionDate: Date
  Status: 'SUCCESS' | 'FAIL' | 'CANCELED'
  Type: ''
  UserId: string
  User: User
}

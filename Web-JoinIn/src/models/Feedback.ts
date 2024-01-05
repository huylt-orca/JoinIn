import { User } from './User'

export interface Feedback {
  Id: string
  Content: string
  Rating: number
  FeedbackedDate: Date
  Status: 'ACTIVE' | 'INACTIVE'
  FeedbackedById: string
  FeedbackedForId: string
  FeedbackedBy: User
  FeedbackedFor: User
}

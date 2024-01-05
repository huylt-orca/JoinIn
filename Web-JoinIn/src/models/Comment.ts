import { Task } from './Task'

export interface Comment {
  Id: string
  Content: string
  CreatedDate: Date
  Status: 'ACTIVE' | 'INACTIVE'
  TaskId: string
  Task: Task
}

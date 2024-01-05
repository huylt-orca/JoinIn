import { Member } from './Member'
import { Task } from './Task'

export interface AssignedTask {
  TaskId: string
  AssignedForId: string
  AssignedById: string
  AssignedDate: Date
  Task: Task
  AssignedFor: Member
  AssignedBy: Member
}

import { AssignedTask } from './AssignedTask'
import { Group } from './Group'
import { Task } from './Task'
import { User } from './User'

export interface Member {
  Id: string
  UserId: string
  GroupId: string
  JoinedDate: Date
  LeftDate: Date
  Role: 'MEMBER' | 'SUB_LEADER' | 'LEADER'
  User: User
  Group: Group
  AssignedTasksFor: AssignedTask[]
  AssignedTasksBy: AssignedTask[]
  Tasks: Task[]
}

import { AssignedTask } from './AssignedTask'
import { Group } from './Group'
import { User } from './User'

export interface Task {
  Id?: string
  Name?: string
  StartDateDeadline?: Date
  EndDateDeadline?: Date
  FinishedDate?: Date
  ImpotantLevel?: 'OPTIONAL' | ' LOW' | ' MEDIUM' | ' HIGH' | ' VERY_HIGH'
  EstimatedDays?: number
  Description?: string
  Status?: 'NOT_STARTED_YET' | 'WORKING' | 'FINISHED'
  GroupId?: string
  CreatedById?: string
  MainTaskId?: string
  Group?: Group
  CreatedBy?: User
  MainTask?: Task
  SubTasks?: Task[]
  AssignedTasks?: AssignedTask[]
  Comments?: Comment[]
}

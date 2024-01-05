import { Group } from './Group'

export interface Milestone {
  Id?: string
  Name?: string
  Description?: string
  Order?: number
  GroupId?: string
  Group?: Group
  GroupForCurrent?: Group
}

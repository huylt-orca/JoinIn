import { Group, Major } from './index'

export interface GroupMajor {
  GroupId: string
  MajorId: string
  MemberCount: number
  Status: 'OPEN' | 'CLOSE'
  Group: Group
  Major: Major
}

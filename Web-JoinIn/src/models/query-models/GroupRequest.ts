
export interface GroupRequest {
  Id?: string
  Name?: string
  CreatedDate?: Date | null
  GroupSize?: number | null
  MemberCount?: number | null
  SchoolName?: string | null
  ClassName?: string | null
  SubjectName?: string | null
  Description?: string | null
  Skill?: string | null
  Avatar?: string | null
  Theme?: string | null
  Status?: 'ACTIVE' | 'INACTIVE'
  CurrentMilestoneId?: string
}

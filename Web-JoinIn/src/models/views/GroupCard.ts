import { MajorGroupCard } from "./MajorGroupCard"

export interface GroupCard {
  Id?: string
  Name?: string
  MemberCount?: number
  SchoolName?: string
  ClassName?: string
  SubjectName?: string
  Major?: MajorGroupCard[]
  Avatar: string
  Theme: string
}

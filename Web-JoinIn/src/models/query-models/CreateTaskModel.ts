export class CreateTaskModel {
  name: string | undefined
  startDateDeadline: string | undefined
  endDateDeadline: string | undefined
  impotantLevel: number
  estimatedDays: number
  description: string | undefined
  mainTaskId: string | undefined
  groupId: string | undefined

  constructor(value: Partial<CreateTaskModel>) {
    this.name = value?.name
    this.startDateDeadline = value?.startDateDeadline
    this.endDateDeadline = value?.endDateDeadline
    this.impotantLevel = value?.impotantLevel ?? 0
    this.estimatedDays = value?.estimatedDays ?? 0
    this.description = value?.description
    this.mainTaskId = value?.mainTaskId
    this.groupId = value?.groupId
  }
}

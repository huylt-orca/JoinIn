export class UpdateTaskModel {
  id: string
  name: string
  startDateDeadline: string
  endDateDeadline: string
  impotantLevel: number
  estimatedDays: number
  description: string
  status: number

  constructor(value: UpdateTaskModel) {
    this.id = value.id
    this.name = value.name
    this.startDateDeadline = value.startDateDeadline
    this.endDateDeadline = value.endDateDeadline
    this.impotantLevel = value.impotantLevel
    this.estimatedDays = value.estimatedDays
    this.description = value.description
    this.status = value.status
  }
}

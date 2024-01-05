export class DashboardPerMonthModel {
  month: number
  startDate: string
  endDate: string
  userCount: number
  transactionCount: number

  constructor(value?: Partial<DashboardPerMonthModel> | any) {
    this.month = value?.month ?? 0
    this.startDate = value?.startDate ?? ''
    this.endDate = value?.endDate ?? ''
    this.userCount = value?.userCount ?? ''
    this.transactionCount = value?.transactionCount ?? ''
  }
}

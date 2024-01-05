export class QueryTransactionListModel {
  pageSize: number | undefined
  pageNumber: number | undefined
  endDate: string | undefined
  startDate: string | undefined
  userId: string | undefined
  transactionStatus: number | undefined
  code: string | undefined
  id: string | undefined

  constructor(value?: Partial<QueryTransactionListModel>) {
    this.pageSize = value?.pageSize
    this.pageNumber = value?.pageNumber
    this.endDate = value?.endDate
    this.startDate = value?.startDate
    this.userId = value?.userId
    this.transactionStatus = value?.transactionStatus
    this.code = value?.code
    this.id = value?.id
  }
}

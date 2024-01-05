export class QueryFeedbackListModel {
  pageSize: number | undefined
  page: number | undefined
  orderBy: string | undefined
  value: string | undefined

  constructor(value?: Partial<QueryFeedbackListModel>) {
    this.pageSize = value?.pageSize
    this.page = value?.page
    this.orderBy = value?.orderBy
    this.value = value?.value
  }
}

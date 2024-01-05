export class QueryGroupListModel {
  name: string | undefined
  majorIdsString: string | undefined
  type: string | undefined
  pageSize: number | undefined
  page: number | undefined
  orderBy: string | undefined
  value: string | undefined

  constructor(value?: Partial<QueryGroupListModel>) {
    this.name = value?.name
    this.type = value?.type
    this.majorIdsString = value?.majorIdsString
    this.pageSize = value?.pageSize
    this.page = value?.page
    this.orderBy = value?.orderBy
    this.value = value?.value
  }
}

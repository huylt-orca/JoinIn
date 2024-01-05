export class QueryApplicationListModel {
  groupId: string | undefined
  name: string | undefined
  majorIdsString: string | undefined
  pageSize: number | undefined
  page: number | undefined
  orderBy: string | undefined
  value: string | undefined

  constructor(value?: Partial<QueryApplicationListModel>) {
    this.groupId = value?.groupId
    this.name = value?.name
    this.majorIdsString = value?.majorIdsString
    this.pageSize = value?.pageSize
    this.page = value?.page
    this.orderBy = value?.orderBy
    this.value = value?.value
  }
}

export class QueryTaskListsModel {
  groupId: string
  name: string
  pageSize: number
  page: number
  orderBy: string
  value: string
  total: number

  constructor(value?: Partial<QueryTaskListsModel>) {
    this.groupId = value?.groupId ?? ''
    this.name = value?.name ?? ''
    this.pageSize = value?.pageSize ?? 10
    this.page = value?.page ?? 1
    this.orderBy = value?.orderBy ?? ''
    this.value = value?.value ?? ''
    this.total = value?.total ?? 0
  }
}

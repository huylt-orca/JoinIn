export class QueryUsersModel {
  email: string
  pageSize: number
  pageNumber: number
  total: number

  constructor(value?: Partial<QueryUsersModel> | any) {
    this.email = value?.email ?? ''
    this.pageSize = value?.pageSize ?? 10
    this.pageNumber = value?.pageNumber ?? 1
    this.total = value?.total ?? 0
  }
}

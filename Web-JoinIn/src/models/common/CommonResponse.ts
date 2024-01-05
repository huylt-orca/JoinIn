import { Pagination } from './Pagination'

export class CommonResponse {
  data: any | any[] | undefined
  message: string
  status: number
  pagination: Pagination

  constructor(value: Partial<CommonResponse> | any) {
    this.data = value?.data
    this.message = value?.message ?? ''
    this.status = value?.status ?? 0
    this.pagination = value?.pagination
  }
}

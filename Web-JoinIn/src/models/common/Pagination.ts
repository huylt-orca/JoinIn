export class Pagination {
  private _currentPage: number | undefined
  private _pageSize: number | undefined
  private _total: number | undefined

  constructor(value: Partial<Pagination>) {
    this.currentPage = value.currentPage ?? 0
    this.pageSize = value.pageSize ?? 0
    this.total = value.total ?? 0
  }

  get currentPage() {
    return this._currentPage
  }

  set currentPage(val: number | undefined) {
    this._currentPage = val
  }

  get pageSize() {
    return this._pageSize
  }

  set pageSize(val: number | undefined) {
    this._pageSize = val
  }

  get total() {
    return this._total
  }

  set total(val: number | undefined) {
    this._total = val
  }
}

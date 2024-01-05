

export class DashboardType {
  private _totalRevenue: number | undefined
  private _totalUser: number | undefined
  private _totalFreemiumUser: number | undefined
  private _totalPremiumUser: number | undefined
  private _totalUserGrownPercentLastWeek: number | undefined
  private _freeUserCount: number[] | undefined
  private _preUserCount: number[] | undefined
  private _activeUserCount: number[] | undefined
  private _tiktokUser: number | undefined
  private _facebookUser: number | undefined
  private _unknownUser: number | undefined
  private _groupCount: number[] | undefined

  constructor(value?: any) {
    this.totalRevenue = value?.totalRevenue
    this.totalUser = value?.totalUser
    this.totalFreemiumUser = value?.totalFreemiumUser
    this.totalPremiumUser = value?.totalPremiumUser
    this.totalUserGrownPercentLastWeek = value?.totalUserGrownPercentLastWeek
    this.freeUserCount = value?.freeUserCount
    this.preUserCount = value?.preUserCount
    this.activeUserCount = value?.activeUserCount
    this.unknownUser = value?.unknownUser
    this.tiktokUser = value?.tiktokUser
    this.facebookUser = value?.facebookUser
    this.groupCount = value?.groupCount
  }

  get totalRevenue() {
    return this._totalRevenue
  }

  set totalRevenue(val: number | undefined) {
    this._totalRevenue = val
  }

  get totalUser() {
    return this._totalUser
  }

  set totalUser(val: number | undefined) {
    this._totalUser = val
  }

  get totalFreemiumUser() {
    return this._totalFreemiumUser
  }

  set totalFreemiumUser(val: number | undefined) {
    this._totalFreemiumUser = val
  }

  get totalPremiumUser() {
    return this._totalPremiumUser
  }

  set totalPremiumUser(val: number | undefined) {
    this._totalPremiumUser = val
  }

  get totalUserGrownPercentLastWeek() {
    return this._totalUserGrownPercentLastWeek
  }

  set totalUserGrownPercentLastWeek(val: number | undefined) {
    this._totalUserGrownPercentLastWeek = val
  }

  get freeUserCount() {
    return this._freeUserCount
  }

  set freeUserCount(val: number[] | undefined) {
    this._freeUserCount = val
  }

  get preUserCount() {
    return this._preUserCount
  }

  set preUserCount(val: number[] | undefined) {
    this._preUserCount = val
  }

  get activeUserCount() {
    return this._activeUserCount
  }

  set activeUserCount(val: number[] | undefined) {
    this._activeUserCount = val
  }

  get tiktokUser() {
    return this._tiktokUser
  }

  set tiktokUser(val: number | undefined) {
    this._tiktokUser = val
  }

  get facebookUser() {
    return this._facebookUser
  }

  set facebookUser(val: number | undefined) {
    this._facebookUser = val
  }

  get unknownUser() {
    return this._unknownUser
  }

  set unknownUser(val: number | undefined) {
    this._unknownUser = val
  }

  get groupCount() {
    return this._groupCount
  }

  set groupCount(val: number[] | undefined) {
    this._groupCount = val
  }

}

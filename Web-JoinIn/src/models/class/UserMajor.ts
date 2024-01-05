import { Major, User } from '.'

export class UserMajor {
  private _userId: string | undefined
  private _majorId: string | undefined
  private _user: User | undefined
  private _major: Major | undefined

  constructor(value?: any) {
    this.userId = value?.userId
    this.majorId = value?.majorId
    this.user = value?.user
    this.major = value?.major
  }

  get userId() {
    return this._userId
  }

  set userId(val: string | undefined) {
    this._userId = val
  }

  get majorId() {
    return this._majorId
  }

  set majorId(val: string | undefined) {
    this._majorId = val
  }

  get user() {
    return this._user
  }

  set user(val: User | undefined) {
    this._user = val
  }

  get major() {
    return this._major
  }

  set major(val: Major | undefined) {
    this._major = val
  }
}

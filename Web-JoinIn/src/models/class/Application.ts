import { User, Group, ApplicationMajor } from '.'

export class Application {
  private _id: string | undefined
  private _createdDate: Date | undefined
  private _status: 'WAITING' | 'APPROVED' | 'DISAPPROVED'  | 0 | 1 | 2 | undefined
  private _confirmedDate: Date | undefined
  private _description: string | undefined
  private _userId: string | undefined
  private _groupId: string | undefined
  private _user: User | undefined
  private _group: Group | undefined
  private _applicationMajors: ApplicationMajor[] | undefined

  get id() {
    return this._id
  }

  set id(val: string | undefined) {
    this._id = val
  }

  get createdDate() {
    return this._createdDate
  }

  set createdDate(val: Date | undefined) {
    this._createdDate = val
  }

  get status() {
    switch (this._status){
      case 0:
        return 'WAITING'
      case 1:
        return 'APPROVED'
      case 2:
        return 'DISAPPROVED'
      default:
        return this._status
    }
  }

  set status(val: 'WAITING' | 'APPROVED' | 'DISAPPROVED'  | 0 | 1 | 2 | undefined) {
    this._status = val
  }

  get confirmedDate() {
    return this._confirmedDate
  }

  set confirmedDate(val: Date | undefined) {
    this._confirmedDate = val
  }

  get description() {
    return this._description
  }

  set description(val: string | undefined) {
    this._description = val
  }

  get groupId() {
    return this._groupId
  }

  set groupId(val: string | undefined) {
    this._groupId = val
  }

  get userId() {
    return this._userId
  }

  set userId(val: string | undefined) {
    this._userId = val
  }

  get user() {
    return this._user
  }

  set user(val: User | undefined) {
    this._user = val
  }

  get group() {
    return this._group
  }

  set group(val: Group | undefined) {
    this._group = val
  }

  get applicationMajors() {
    return this._applicationMajors
  }

  set applicationMajors(val: ApplicationMajor[] | undefined) {
    this._applicationMajors = val
  }

  constructor(value?: Partial<Application>) {
    this.id = value?.id
    this.createdDate = value?.createdDate
    this.status = value?.status
    this.confirmedDate = value?.confirmedDate
    this.description = value?.description
    this.userId = value?.userId
    this.groupId = value?.groupId
    this.user = value?.user
    this.group = value?.group
    this.applicationMajors = value?.applicationMajors
  }
}

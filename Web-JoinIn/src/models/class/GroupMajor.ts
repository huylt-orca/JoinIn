import { Group, Major } from './index'

export class GroupMajor {
  private _groupId: string | undefined
  private _majorId: string | undefined
  private _memberCount: number | undefined
  private _status: 'OPEN' | 'CLOSE' | undefined
  private _group: Group | undefined
  private _major: Major | undefined

  constructor(value?: any) {
    this.groupId = value?.groupId
    this.majorId = value?.majorId
    this.memberCount = value?.memberCount
    this.status = value?.status
    this.group = value?.group
    this.major = value?.major
  }

  get groupId() {
    return this._groupId
  }

  set groupId(val: string | undefined) {
    this._groupId = val
  }

  get majorId() {
    return this._majorId
  }

  set majorId(val: string | undefined) {
    this._majorId = val
  }

  get memberCount() {
    return this._memberCount
  }

  set memberCount(val: number | undefined) {
    this._memberCount = val
  }

  get status() {
    return this._status
  }

  set status(val: 'OPEN' | 'CLOSE' | undefined) {
    this._status = val
  }

  get group() {
    return this._group
  }

  set group(val: Group | undefined) {
    this._group = val
  }

  get major() {
    return this._major
  }

  set major(val: Major | undefined) {
    this._major = val
  }
}

import { Group } from '.'

export class Milestone {
  private _id: string | undefined
  private _name: string | undefined
  private _description: string | undefined
  private _order: number | undefined
  private _groupId: number | undefined
  private _group: Group | undefined
  private _groupForCurrent: Group | undefined

  constructor(value: Partial<Milestone>) {
    this.id = value?.id
    this.name = value?.name
    this.description = value?.description
    this.order = value?.order
    this.groupId = value?.groupId
    this.group = value?.group
    this.groupForCurrent = value?.groupForCurrent
  }

  get id() {
    return this._id
  }

  set id(val: string | undefined) {
    this._id = val
  }

  get name() {
    return this._name
  }

  set name(val: string | undefined) {
    this._name = val
  }

  get description() {
    return this._description
  }

  set description(val: string | undefined) {
    this._description = val
  }

  get order() {
    return this._order
  }

  set order(val: number | undefined) {
    this._order = val
  }

  get groupId() {
    return this._groupId
  }

  set groupId(val: number | undefined) {
    this._groupId = val
  }

  get group() {
    return this._group
  }

  set group(val: Group | undefined) {
    this._group = val
  }

  get groupForCurrent() {
    return this._groupForCurrent
  }

  set groupForCurrent(val: Group | undefined) {
    this._groupForCurrent = val
  }
}

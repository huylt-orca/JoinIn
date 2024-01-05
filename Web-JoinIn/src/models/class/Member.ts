import { AssignedTask, Group, Task, User } from '.'

export class Member {
  private _id: string | undefined
  private _userId: string | undefined
  private _groupId: string | undefined
  private _joinedDate: Date | undefined
  private _leftDate: Date | undefined
  private _role: 'MEMBER' | 'SUB_LEADER' | 'LEADER'  | 0 | 1 | 2 | undefined
  private _user: User | undefined
  private _group: Group | undefined
  private _assignedTasksFor: AssignedTask[] | undefined
  private _assignedTasksBy: AssignedTask[] | undefined
  private _asks: Task[] | undefined

  constructor(value?: Partial<Member>) {
    this.id = value?.id
    this.userId = value?.userId
    this.groupId = value?.groupId
    this.joinedDate = value?.joinedDate
    this.leftDate = value?.leftDate
    this.role = value?.role
    this.user = value?.user
    this.group = value?.group
    this.assignedTasksFor = value?.assignedTasksFor
    this.assignedTasksBy = value?.assignedTasksBy
    this.asks = value?.asks
  }

  get id() {
    return this._id
  }

  set id(val: string | undefined) {
    this._id = val
  }

  get userId() {
    return this._userId
  }

  set userId(val: string | undefined) {
    this._userId = val
  }

  get groupId() {
    return this._groupId
  }

  set groupId(val: string | undefined) {
    this._groupId = val
  }

  get joinedDate() {
    return this._joinedDate
  }

  set joinedDate(val: Date | undefined) {
    this._joinedDate = val
  }

  get leftDate() {
    return this._leftDate
  }

  set leftDate(val: Date | undefined) {
    this._leftDate = val
  }

  get role() {
    switch (this._role){
      case 0:
        return 'MEMBER'
      case 1:
        return 'SUB_LEADER'
      case 2:
        return 'LEADER'
      default:
        return this._role
    }
  }

  set role(val: 'MEMBER' | 'SUB_LEADER' | 'LEADER'  | 0 | 1 | 2 | undefined) {
    this._role = val
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

  get assignedTasksFor() {
    return this._assignedTasksFor
  }

  set assignedTasksFor(val: AssignedTask[] | undefined) {
    this._assignedTasksFor = val
  }

  get assignedTasksBy() {
    return this._assignedTasksBy
  }

  set assignedTasksBy(val: AssignedTask[] | undefined) {
    this._assignedTasksBy = val
  }

  get asks() {
    return this._asks
  }

  set asks(val: Task[] | undefined) {
    this._asks = val
  }
}

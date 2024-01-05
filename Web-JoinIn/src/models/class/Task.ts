import { AssignedTask, Group, User, Comment } from './index'

export class Task {
  private _id: undefined | string
  private _name: string | undefined
  private _startDateDeadline: string | undefined
  private _endDateDeadline: string | undefined
  private _finishedDate: string | undefined
  private _impotantLevel: 'OPTIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 0 | 1 | 2 | 3 | 4 | undefined
  private _estimatedDays: number | undefined
  private _description: string | undefined
  private _status: 'NOT_STARTED_YET' | 'WORKING' | 'FINISHED' | 0 | 1 | 2 | undefined
  private _groupId: string | undefined
  private _createdById: string | undefined
  private _mainTaskId: string | undefined
  private _group: Group | undefined
  private _createdBy: User | undefined
  private _mainTask: Task | undefined
  private _subTasks: Task[] | undefined
  private _assignedTasks: AssignedTask[] | undefined
  private _comments: Comment[] | undefined
  private _assignedFor: User[] | undefined

  constructor(value?: Partial<Task>) {
    this.id = value?.id
    this.name = value?.name
    this.startDateDeadline = value?.startDateDeadline
    this.endDateDeadline = value?.endDateDeadline
    this.finishedDate = value?.finishedDate
    this.impotantLevel = value?.impotantLevel
    this.estimatedDays = value?.estimatedDays
    this.description = value?.description
    this.status = value?.status
    this.groupId = value?.groupId
    this.createdById = value?.createdById
    this.mainTaskId = value?.mainTaskId
    this.group = value?.group
    this.createdBy = value?.createdBy
    this.mainTask = value?.mainTask
    this.subTasks = value?.subTasks
    this.assignedTasks = value?.assignedTasks
    this.comments = value?.comments
    this.assignedFor = value?.assignedFor
  }

  get id() {
    return this._id
  }

  set id(val: undefined | string) {
    this._id = val
  }

  get name() {
    return this._name
  }

  set name(val: string | undefined) {
    this._name = val
  }

  get startDateDeadline() {
    return this._startDateDeadline
  }

  set startDateDeadline(val: string | undefined) {
    this._startDateDeadline = val
  }

  get endDateDeadline() {
    return this._endDateDeadline
  }

  set endDateDeadline(val: string | undefined) {
    this._endDateDeadline = val
  }

  get finishedDate() {
    return this._finishedDate
  }

  set finishedDate(val: string | undefined) {
    this._finishedDate = val
  }

  get impotantLevel() {
    return this._impotantLevel
  }

  set impotantLevel(val: 'OPTIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 0 | 1 | 2 | 3 | 4 | undefined) {
    this._impotantLevel = val
  }

  get estimatedDays() {
    return this._estimatedDays
  }

  set estimatedDays(val: number | undefined) {
    this._estimatedDays = val
  }

  get description() {
    return this._description
  }

  set description(val: string | undefined) {
    this._description = val
  }

  get status() {
    return this._status
  }

  set status(val: 'NOT_STARTED_YET' | 'WORKING' | 'FINISHED' | 0 | 1 | 2 | undefined) {
    this._status = val
  }

  get groupId() {
    return this._groupId
  }

  set groupId(val: string | undefined) {
    this._groupId = val
  }

  get createdById() {
    return this._createdById
  }

  set createdById(val: string | undefined) {
    this._createdById = val
  }

  get mainTaskId() {
    return this._mainTaskId
  }

  set mainTaskId(val: string | undefined) {
    this._mainTaskId = val
  }

  get group() {
    return this._group
  }

  set group(val: Group | undefined) {
    this._group = val
  }

  get createdBy() {
    return this._createdBy
  }

  set createdBy(val: User | undefined) {
    this._createdBy = val
  }

  get mainTask() {
    return this._mainTask
  }

  set mainTask(val: Task | undefined) {
    this._mainTask = val
  }

  get subTasks() {
    return this._subTasks
  }

  set subTasks(val: Task[] | undefined) {
    this._subTasks = val
  }

  get assignedTasks() {
    return this._assignedTasks
  }

  set assignedTasks(val: AssignedTask[] | undefined) {
    this._assignedTasks = val
  }

  get comments() {
    return this._comments
  }

  set comments(val: Comment[] | undefined) {
    this._comments = val
  }

  get assignedFor() {
    return this._assignedFor
  }

  set assignedFor(val: User[] | undefined) {
    this._assignedFor = val
  }
}

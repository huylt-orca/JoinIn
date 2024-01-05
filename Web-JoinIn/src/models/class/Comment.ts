import { Task } from './Task'

export class Comment {
  private _id: string | undefined
  private _content: string | undefined
  private _createdDate: Date | string | undefined
  private _status: 'ACTIVE' | 'INACTIVE' | undefined
  private _taskId: string | undefined
  private _memberId: string | undefined
  private _task: Task | undefined

  constructor(value?: Partial<Comment> | any) {
    this.id = value?.id
    this.content = value?.content
    this.createdDate = value?.createdDate
    this.status = value?.status
    this.taskId = value?.taskId
    this.memberId = value?.memberId
    this.task = value?.task
  }

  get id() {
    return this._id
  }

  set id(val: string | undefined) {
    this._id = val
  }

  get content() {
    return this._content
  }

  set content(val: string | undefined) {
    this._content = val
  }

  get createdDate() {
    return this._createdDate
  }

  set createdDate(val: Date | string | undefined) {
    this._createdDate = val
  }

  get status() {
    return this._status
  }

  set status(val: 'ACTIVE' | 'INACTIVE' | undefined) {
    this._status = val
  }

  get taskId() {
    return this._taskId
  }

  set taskId(val: string | undefined) {
    this._taskId = val
  }

  get memberId() {
    return this._memberId
  }

  set memberId(val: string | undefined) {
    this._memberId = val
  }

  get task() {
    return this._task
  }

  set task(val: Task | undefined) {
    this._task = val
  }
}

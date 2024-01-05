import { Application, GroupMajor, Member, Milestone, Task } from '.'

export class Group {
  private _id: string | undefined
  private _name: string | undefined
  private _avatar: string | undefined
  private _theme: string | undefined
  private _createdDate: Date | string | undefined
  private _groupSize: number | undefined
  private _memberCount: number | undefined
  private _schoolName: string | undefined
  private _className: string | undefined
  private _subjectName: string | undefined
  private _description: string | undefined
  private _skill: string | undefined
  private _status: 'ACTIVE' | 'INACTIVE' | undefined
  private _currentMilestoneId: number | undefined
  private _currentMilestone: Milestone | undefined
  private _milestones: Milestone[] | undefined
  private _tasks: Task[] | undefined
  private _groupMajors: GroupMajor[] | undefined
  private _applications: Application[] | undefined
  private _members: Member[] | undefined
  private _createdBy: Member | undefined

  constructor(value: Partial<Group>) {
    this.id = value?.id
    this.name = value?.name
    this.createdDate = value?.createdDate
    this.groupSize = value?.groupSize
    this.memberCount = value?.memberCount
    this.schoolName = value?.schoolName
    this.className = value?.className
    this.subjectName = value?.subjectName
    this.description = value?.description
    this.skill = value?.skill
    this.status = value?.status
    this.currentMilestoneId = value?.currentMilestoneId
    this.currentMilestone = value?.currentMilestone
    this.milestones = value?.milestones
    this.tasks = value?.tasks
    this.groupMajors = value?.groupMajors
    this.applications = value?.applications
    this.members = value?.members
    this.createdBy = value?.createdBy
    this.avatar = value?.avatar
    this.theme = value?.theme
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

  get avatar() {
    return this._avatar
  }

  set avatar(val: string | undefined) {
    this._avatar = val
  }

  get theme() {
    return this._theme
  }

  set theme(val: string | undefined) {
    this._theme = val
  }

  get createdDate() {
    return this._createdDate
  }

  set createdDate(val: Date | string | undefined) {
    this._createdDate = val
  }

  get groupSize() {
    return this._groupSize
  }

  set groupSize(val: number | undefined) {
    this._groupSize = val
  }

  get memberCount() {
    return this._memberCount
  }

  set memberCount(val: number | undefined) {
    this._memberCount = val
  }

  get schoolName() {
    return this._schoolName
  }

  set schoolName(val: string | undefined) {
    this._schoolName = val
  }

  get className() {
    return this._className
  }

  set className(val: string | undefined) {
    this._className = val
  }

  get subjectName() {
    return this._subjectName
  }

  set subjectName(val: string | undefined) {
    this._subjectName = val
  }

  get description() {
    return this._description
  }

  set description(val: string | undefined) {
    this._description = val
  }

  get skill() {
    return this._skill
  }

  set skill(val: string | undefined) {
    this._skill = val
  }

  get status() {
    return this._status
  }

  set status(val: 'ACTIVE' | 'INACTIVE' | undefined) {
    this._status = val
  }

  get currentMilestoneId() {
    return this._currentMilestoneId
  }

  set currentMilestoneId(val: number | undefined) {
    this._currentMilestoneId = val
  }

  get currentMilestone() {
    return this._currentMilestone
  }

  set currentMilestone(val: Milestone | undefined) {
    this._currentMilestone = val
  }

  get milestones() {
    return this._milestones
  }

  set milestones(val: Milestone[] | undefined) {
    this._milestones = val
  }

  get tasks() {
    return this._tasks
  }

  set tasks(val: Task[] | undefined) {
    this._tasks = val
  }

  get groupMajors() {
    return this._groupMajors
  }

  set groupMajors(val: GroupMajor[] | undefined) {
    this._groupMajors = val
  }

  get applications() {
    return this._applications
  }

  set applications(val: Application[] | undefined) {
    this._applications = val
  }

  get members() {
    return this._members
  }

  set members(val: Member[] | undefined) {
    this._members = val
  }

  get createdBy() {
    return this._createdBy
  }

  set createdBy(val: Member | undefined) {
    this._createdBy = val
  }
}

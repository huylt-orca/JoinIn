import { Application, Feedback, Major, Member, Transaction, UserMajor } from '.'

export class User {
  id: string | undefined
  fullName: string | undefined
  password: string | undefined
  email: string | undefined
  phone: string | undefined
  birthDay: Date | string | undefined
  gender: boolean | undefined
  description: string | undefined
  skill: string | undefined
  otherContact: string | undefined
  avatar: string | undefined
  theme: string | undefined
  status: 'ACTIVE' | 'INACTIVE' | 0 | 1 | undefined
  isAdmin: boolean | undefined
  receivedFeedbacks: Feedback[] | undefined
  sentFeedbacks: Feedback[] | undefined
  transactions: Transaction[] | undefined
  userMajors: UserMajor[] | undefined
  members: Member[] | undefined
  applications: Application[] | undefined
  majors: Major[] | undefined

  constructor(value?: Partial<User>) {
    this.id = value?.id
    this.fullName = value?.fullName
    this.password = value?.password
    this.email = value?.email
    this.phone = value?.phone
    this.birthDay = value?.birthDay
    this.gender = value?.gender
    this.description = value?.description
    this.skill = value?.skill
    this.otherContact = value?.otherContact
    this.avatar = value?.avatar
    this.theme = value?.theme
    this.status = value?.status
    this.isAdmin = value?.isAdmin
    this.receivedFeedbacks = value?.receivedFeedbacks
    this.sentFeedbacks = value?.sentFeedbacks
    this.transactions = value?.transactions
    this.userMajors = value?.userMajors
    this.members = value?.members
    this.applications = value?.applications
    this.majors = value?.majors
  }
}

export class UserCompleteProfileModel {
  fullName: string | undefined
  birthDay: string | undefined
  gender: boolean | undefined
  description: string | undefined
  skill: string | undefined
  otherContact: string | undefined
  avatar: string | undefined
  theme: string | undefined
  majorIdList: string[] | undefined
  phoneNumber: string | undefined
  platForm: 0 | 1 | 2

  constructor(value?: Partial<UserCompleteProfileModel>) {
    this.fullName = value?.fullName
    this.birthDay = value?.birthDay
    this.gender = value?.gender
    this.description = value?.description
    this.skill = value?.skill
    this.otherContact = value?.otherContact
    this.avatar = value?.avatar
    this.theme = value?.theme
    this.majorIdList = value?.majorIdList
    this.phoneNumber = value?.phoneNumber
    this.platForm = value?.platForm === undefined ? 2 : value?.platForm
  }
}

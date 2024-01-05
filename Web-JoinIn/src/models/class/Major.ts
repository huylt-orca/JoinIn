import { GroupMajor, UserMajor, ApplicationMajor } from '.'

export class Major {
  public id: string | undefined
  public name: string | undefined
  public shortName: string | undefined
  public applicationMajors: ApplicationMajor[] | undefined
  public groupMajors: GroupMajor[] | undefined
  public userMajors: UserMajor[] | undefined

  constructor(value?: any) {
    this.id = value?.id
    this.name = value?.name
    this.shortName = value?.shortName
    this.applicationMajors = value?.applicationMajors
    this.groupMajors = value?.groupMajors
    this.userMajors = value?.userMajors
  }
}

import { Application } from './Application'
import { Major } from './Major'

export interface ApplicationMajor {
  ApplicationId: string
  MajorId: string
  Application: Application
  Major: Major
}

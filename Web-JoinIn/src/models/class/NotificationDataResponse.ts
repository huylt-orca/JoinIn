import { Notification } from './Notification'

export class NotificationDataResponse {
  notificationDTOs: Notification[]
  hasSeenNumber: 0
  hasUnreadNumber: 0

  constructor(value?: Partial<NotificationDataResponse>) {
    this.notificationDTOs = value?.notificationDTOs ?? []
    this.hasSeenNumber = value?.hasSeenNumber ?? 0
    this.hasUnreadNumber = value?.hasUnreadNumber ?? 0
  }
}

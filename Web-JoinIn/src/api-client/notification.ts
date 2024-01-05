import axiosClient from './api-client'

export const notificationAPI = {
  getNotification(size: number) {
    return axiosClient.get(`/notifications?pageSize=${size}`)
  },

  readNotification(notificationIdList: string[]) {
    return axiosClient.put(`/notifications?`, {
      notificationUpdateDTOs: notificationIdList
    })
  }
} 

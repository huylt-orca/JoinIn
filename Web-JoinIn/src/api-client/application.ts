import { ApplicationRequest } from 'src/models/query-models/ApplicationRequest'
import axiosClient from './api-client'
import { QueryApplicationListModel } from 'src/models/query-models/QueryApplicationListModel'

const URL = '/applications'

export const applicationAPI = {
  async getList(payload?: QueryApplicationListModel) {
    return axiosClient.get(`${URL}`, {
      params: payload
    })
  },

  postApplication(data: ApplicationRequest) {
    return axiosClient.post(`${URL}/send-application`, data)
  },

  postInvitation(data: ApplicationRequest) {
    return axiosClient.post(`${URL}/send-invitation`, data)
  },

  putApplication(data: any) {
    return axiosClient.put(`${URL}/confirm-application`, data)
  },

  getInviteApplication(applicationId: any) {
    return axiosClient.get(`${URL}/${applicationId}`)
  },

  userConfirmInvite(applicationId: string, status: 4 | 5) {
    return axiosClient.get('/applications/confirm-invitation', {
      params: {
        invitationId: applicationId,
        status: status
      } 
    })
  }
}

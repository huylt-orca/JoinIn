import { Group } from 'src/models/class'
import axiosClient from './api-client'
import { GroupRequest } from 'src/models/query-models/GroupRequest'
import { QueryGroupListModel } from 'src/models/query-models/QueryGroupListModel'

const URL = '/groups'

export const groupAPI = {
  getList(payload?: QueryGroupListModel) {
    return axiosClient.get(`${URL}`, {
      params: payload
    })
  },

  async getListRecruiting(groupId: string) {
    return axiosClient.get(`${URL}/${groupId}/recruiting-information`)
  },

  getListFindingGroup(payload?: QueryGroupListModel) {
    return axiosClient.get(`${URL}/search-to-apply`, {
      params: payload
    })
  },

  getById(id?: string) {
    return axiosClient.get(`${URL}/${id}`)
  },

  post(data: GroupRequest) {
    return axiosClient.post(`${URL}`, data)
  },

  delete(id: string) {
    return axiosClient.delete(`${URL}/${id}`)
  },

  put(data: GroupRequest) {
    return axiosClient.put(`${URL}`, data)
  },
  getRoleInGroup(groupId: string) {
    return axiosClient.get(`${URL}/${groupId}/role`)
  },

  putRecruiting(data: any) {
    return axiosClient.put(`/group-majors`, data)
  },

  Admin: {
    getListGroup(): Group[] {
      return []
    }
  }
}

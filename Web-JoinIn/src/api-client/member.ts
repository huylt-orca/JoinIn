import { groupDBDexie } from 'src/models/db/GroupDB'
import axiosClient from './api-client'
import { Member } from 'src/models'

const URL = '/members'

export const memberAPI = {
  async getList(name: string) {
    const groupData = await groupDBDexie.getGroup()

    return axiosClient.get(`${URL}/${groupData?.id}?name=${name}`)
  },

  getAllMember(groupId: string) {
    return axiosClient.get(`${URL}/${groupId}`)
  },

  post(data: Member) {
    return axiosClient.post(`${URL}`, data)
  },

  kickOut(data: any) {
    return axiosClient.put(`${URL}/leader/member`,data)
  },

  moveOut(data: any){
    return axiosClient.put(`${URL}/member`,data)
  },

  put(data: any) {
    return axiosClient.put(`${URL}/assign-role`,data)
  }
}

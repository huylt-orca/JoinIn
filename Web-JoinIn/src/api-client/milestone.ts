import { groupDBDexie } from 'src/models/db/GroupDB';
import axiosClient from './api-client'
import { Milestone } from 'src/models';

const URL = '/milestones';

export const milestoneAPI = {
  async getList() {
    const data = await groupDBDexie.getGroup();

    return axiosClient.get(`${URL}/${data?.id}`)
  },

  getById(id:string) {
    return axiosClient.get(`${URL}/${id}`)
  },

  post(data: Milestone) {
    return axiosClient.post(`${URL}`,data)
  },

  delete(id:string) {
    return axiosClient.delete(`${URL}?id=${id}`)
  },

  put(data: Milestone) {
    return axiosClient.put(`${URL}`,data)
  },
  putCurrent(data: any) {
    return axiosClient.put(`${URL}/updateCurrent`,data)
  }
}

import { User } from 'src/models/class'
import axiosClient from './api-client'
import { UserCompleteProfileModel } from 'src/models/query-models/UserCompleteProfileModel'
import { QueryUsersModel } from 'src/models/query-models/QueryUsersModel'

const URL = '/users'

export const userAPI = {
  getList(email: string) {
    return axiosClient.get(`${URL}?email=${email}`)
  },

  getById(id: string) {
    return axiosClient.get(`${URL}/profile?userId=${id}`)
  },

  post(data: User) {
    return axiosClient.post(`${URL}`, data)
  },

  delete(id: string) {
    return axiosClient.delete(`${URL}/${id}`)
  },

  put(data: UserCompleteProfileModel) {
    return axiosClient.put(`${URL}/update-profile`, data)
  },

  uploadImage(data?: File | undefined) {
    if (data === undefined) {
      return Promise.resolve(true)
    }

    return axiosClient.post(
      `${URL}/upload/image`,
      {
        file: data
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': 'http://localhost:8000',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    )
  },

  getProfile(userId?: string) {
    if (userId) {
      return axiosClient.get(`${URL}/profile`, {
        params: {
          userId: userId
        }
      })
    }

    return axiosClient.get(`${URL}/user/profile`)
  },

  completeProfile(data: UserCompleteProfileModel, verifyToken: string) {
    return axiosClient.put(`${URL}/complete-profile?verifyToken=${verifyToken}`, data)
  },

  getVerifyCode() {
    return axiosClient.get(`${URL}/send-verifyCode`)
  },

  changePassword(payload: { password: string; verifyCode: string }) {
    return axiosClient.put(`${URL}/reset-password`, payload)
  },

  updatePassword(payload: { password: string; verifyCode: string }) {
    return axiosClient.put(`${URL}/update-password`, payload)
  },

  Admin: {
    getListUser(query: QueryUsersModel) {
      return axiosClient.get('/users/admin/user', {
        params: {
          ...query
        }
      })
    },

    getDashboard() {
      return axiosClient.get('/users/dashboard')
    },

    banUser(userId: string) {
      return axiosClient.put(`/users/admin/user/ban?userId=${userId}`)
    },

    unBanUser(userId: string) {
      return axiosClient.put(`/users/admin/user/unban?userId=${userId}`)
    }
  }
}

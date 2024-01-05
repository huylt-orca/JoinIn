import { FeedbackRequest } from 'src/models/query-models/FeedbackRequest'
import axiosClient from './api-client'
import { QueryFeedbackListModel } from 'src/models/query-models/QueryFeedbackListModel'

const URL = '/feedbacks'

export const feedbackAPI = {
  getList(payload?: QueryFeedbackListModel) {
    return axiosClient.get(`${URL}`, {
      params: payload
    })
  },

  getById(id: string) {
    return axiosClient.get(`${URL}/${id}`)
  },

  post(data: FeedbackRequest) {
    return axiosClient.post(`${URL}`, data)
  },

  delete(id: string) {
    return axiosClient.delete(`${URL}/${id}`)
  },
  getRating(userId: string) {
    return axiosClient.get('/feedbacks/average-rating', {
      params: {
        userId: userId
      }
    })
  },

  put(data: FeedbackRequest) {
    return axiosClient.put(`${URL}`, data)
  }
}

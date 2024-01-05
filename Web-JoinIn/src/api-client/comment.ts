import axiosClient from './api-client'

export const commentAPI = {
  getCommentsByTaskId(taskId: string) {
    return axiosClient.get('/comments', {
      params: {
        taskId: taskId
      }
    })
  },
  createComment(payload: { content: string; taskId: string }) {
    return axiosClient.post('/comments', payload)
  }
}

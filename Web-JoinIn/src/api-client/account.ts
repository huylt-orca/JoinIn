import axiosClient from './api-client'

export const authAPI = {
  login(payload: any) {
    return axiosClient.post('/authenticate', payload)
  },

  logout() {
    return axiosClient.post('/logout')
  },

  getProfile() {
    return axiosClient.get('profile')
  },

  signUp(payload: any, platForm: string | undefined) {
    return axiosClient.post(`/register?Platform=${platForm}`, payload)
  },

  sendVerifyEmail(email: string, platForm: string) {
    return axiosClient.get(`/users/send-email-verification`, {
      params: {
        email: email,
        Platform: platForm
      }
    })
  },

  getUrlGoogleLogin() {
    return axiosClient.get('/oauth2/google-sign-in')
  },

  getTokenLoginGoogle(googleToken: string) {
    const data = {
      googleToken: googleToken
    }

    return axiosClient.post('/oauth2/call-back', data)
  }
}

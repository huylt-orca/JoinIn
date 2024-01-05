import { Transaction } from 'src/models/class'
import axiosClient from './api-client'
import { QueryTransactionListModel } from 'src/models/query-models/QueryTransactionListModel'

const URL = '/transactions'

export const transactionAPI = {
  getList(payload?: QueryTransactionListModel) {
    return axiosClient.get('/admin/get-transaction', {
      params: payload
    })
  },

  createTransaction(type: number) {
    return axiosClient.post(`/create/${type}`)
  },

  post(data: Transaction) {
    return axiosClient.post(`${URL}`, data)
  },

  delete(id: string) {
    return axiosClient.delete(`${URL}/${id}`)
  },

  put(data: any) {
    return axiosClient.put(`${URL}/admin/update`, data)
  }

  // Admin: {
  //   getListTraction(): Transaction[] {
  //     const result: Transaction[] = []
  //     for (let index = 0; index < 80; index++) {
  //       result.push(
  //         new Transaction({
  //           id: index,
  //           status: 'SUCCESS',
  //           type: `Type ${index}`,
  //           transactionDate: moment().format('YYYY-MM-DD'),
  //           user: new User({
  //             id: index,
  //             fullName: `Name ${index}`,
  //             avatar: '',
  //             birthDay: moment().format('YYYY-MM-DD'),
  //             email: `email${index}@gmail.com`
  //           })
  //         })
  //       )
  //     }

  //     return result
  //   }
  // }
}

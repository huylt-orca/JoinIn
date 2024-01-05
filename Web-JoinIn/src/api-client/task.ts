import moment from 'moment'
import { StorageKeys } from 'src/constants'
import { AssignedTask, Group, Member, Task, User, Comment } from 'src/models/class'
import axiosClient from './api-client'
import { QueryTaskListsModel } from 'src/models/query-models/QueryTaskListsModel'
import { CreateTaskModel } from 'src/models/query-models/CreateTaskModel'
import { UpdateTaskModel } from 'src/models/query-models/UpdateTaskModel'

const URL = '/tasks'

export const taskAPI = {
  getList(payload?: QueryTaskListsModel) {
    const params = {
      params: { ...payload }
    }

    return axiosClient.get(`${URL}`, params)
  },

  getById(id: string) {
    return axiosClient.get(`${URL}/${id}`)
  },

  createTask(data: CreateTaskModel) {
    return axiosClient.post(`${URL}`, data)
  },

  delete(id: string) {
    return axiosClient.delete(`${URL}?taskId=${id}`)
  },

  updateTask(data: UpdateTaskModel) {
    return axiosClient.put(`${URL}/team-leaders`, data)
  },

  assignTask(data: any) {

    return axiosClient.put(`/assigned-tasks`, data)
  },

  User: {
    getListTodo(): Task[] {
      const result: Task[] = []

      for (let index = 0; index < 80; index++) {
        result.push(
          new Task({
            id: 'index',
            name: 'Task',
            estimatedDays: 2,
            impotantLevel: 'VERY_HIGH',
            startDateDeadline: moment('2022-02-02').format(StorageKeys.KEY_FORMAT_DATE),
            endDateDeadline: moment('2023-02-02').format(StorageKeys.KEY_FORMAT_DATE),
            status: 'FINISHED',
            mainTaskId: 'index',
            createdBy: {
              avatar:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU',
              fullName: 'Hieu'
            } as User,
            assignedTasks: [
              new AssignedTask({
                assignedFor: new Member({
                  user: new User({
                    fullName: 'Nguyen Van A',
                    avatar:
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU'
                  })
                })
              })
            ],
            group: new Group({
              avatar:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU',
              name: `Group ${index}`
            }),
            subTasks: [
              new Task({
                id: '1',
                name: 'Task',
                estimatedDays: 2,
                impotantLevel: 'VERY_HIGH',
                startDateDeadline: moment('2022-02-02').format(StorageKeys.KEY_FORMAT_DATE),
                endDateDeadline: moment('2023-02-02').format(StorageKeys.KEY_FORMAT_DATE),
                status: 'FINISHED',
                createdBy: {
                  avatar:
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU',
                  fullName: 'Hieu'
                } as User,
                assignedTasks: [
                  new AssignedTask({
                    assignedFor: new Member({
                      user: new User({
                        fullName: 'Nguyen Van A',
                        avatar:
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU'
                      })
                    })
                  })
                ],
                group: new Group({
                  avatar:
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU',
                  name: `Group ${index}`
                })
              })
            ]
          })
        )
      }

      return result
    },
    getTaskById(id: any): Task {
      const result: Task = new Task({
        id: id,
        name: id,
        estimatedDays: 2,
        impotantLevel: 'VERY_HIGH',
        startDateDeadline: moment('2022-02-02').format(StorageKeys.KEY_FORMAT_DATE),
        endDateDeadline: moment('2024-02-02').format(StorageKeys.KEY_FORMAT_DATE),
        status: 'FINISHED',
        createdBy: {
          avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU',
          fullName: 'Hieu'
        } as User,
        assignedTasks: [
          new AssignedTask({
            assignedFor: new Member({
              user: new User({
                fullName: 'Nguyen Van A',
                avatar:
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU'
              })
            })
          })
        ],
        group: new Group({
          avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU',
          name: `Group ${id}`
        }),
        subTasks: [
          new Task({
            id: '1',
            name: 'Task',
            estimatedDays: 2,
            impotantLevel: 'VERY_HIGH',
            startDateDeadline: moment('2022-02-02').format(StorageKeys.KEY_FORMAT_DATE),
            endDateDeadline: moment('2023-02-02').format(StorageKeys.KEY_FORMAT_DATE),
            status: 'FINISHED',
            createdBy: {
              avatar:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU',
              fullName: 'Hieu'
            } as User,
            assignedTasks: [
              new AssignedTask({
                assignedFor: new Member({
                  user: new User({
                    fullName: 'Nguyen Van A',
                    avatar:
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU'
                  })
                })
              })
            ],
            group: new Group({
              avatar:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJRMq60qKNIeGgwgDrJtMxH4v7j4vKykszQ&usqp=CAU',
              name: `Group ${id}`
            })
          })
        ],
        comments: [
          new Comment({
            id: '1',
            content: 'content',
            createdDate: '2023-01-01 00:00:00',
            status: 'ACTIVE'
          }),
          new Comment({
            id: '1',
            content: '<h1>content 123</h1>',
            createdDate: '2023-01-01',
            status: 'ACTIVE'
          }),
          new Comment({
            id: '1',
            content: 'content 123',
            createdDate: '2023-01-01',
            status: 'ACTIVE'
          }),
          new Comment({
            id: '2',
            content: 'content 2',
            createdDate: '2023-01-02',
            status: 'ACTIVE'
          }),
          new Comment({
            id: '2',
            content: 'content 3',
            createdDate: '2023-01-03',
            status: 'ACTIVE'
          })
        ]
      })

      return result
    }
  }
}

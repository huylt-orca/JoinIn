import { ObjectSelectType } from 'src/models/common/ObjectSelectType'

export const notificationStatus: ObjectSelectType[] = [
  new ObjectSelectType({
    lable: 'Appointed to the new task',
    value: 'TASK_ASSIGN',
    valueNumber: 0
  }),
  new ObjectSelectType({
    lable: 'Task unassign',
    value: 'UNASSIGN_TASK',
    valueNumber: 1
  }),
  new ObjectSelectType({
    lable: 'Task update',
    value: 'TASK_UPDATE',
    valueNumber: 2
  }),
  new ObjectSelectType({
    lable: 'Recieve feedback',
    value: 'NEW_FEEDBACK',
    valueNumber: 3
  }),
  new ObjectSelectType({
    lable: 'New comment on task',
    value: 'NEW_TASK_COMMENT',
    valueNumber: 4
  }),
  new ObjectSelectType({
    lable: 'New apply in group',
    value: 'NEW_APPLY',
    valueNumber: 5
  }),
  new ObjectSelectType({
    lable: 'Invite to group',
    value: 'NEW_INVITE',
    valueNumber: 6
  }),
  new ObjectSelectType({
    lable: 'Member leave group',
    value: 'GROUP_LEAVING',
    valueNumber: 7
  }),
  new ObjectSelectType({
    lable: 'Group remove',
    value: 'GROUP_REMOVING',
    valueNumber: 8
  }),
  new ObjectSelectType({
    lable: 'Task deleted',
    value: 'TASK_DELETE',
    valueNumber: 9
  })
]

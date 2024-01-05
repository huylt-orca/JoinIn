import { ThemeColor } from 'src/@core/layouts/types'
import { ObjectSelectType } from 'src/models/common/ObjectSelectType'

export interface StatusObj {
  [key: string]: {
    color: ThemeColor
    label?: string
    value?: string
    valueNumber?: number
  }
}

export const statusObj: StatusObj = {
  NOT_STARTED_YET: { color: 'info', label: 'NOT YET', valueNumber: 0 },
  WORKING: { color: 'primary', label: 'WORKING', valueNumber: 1 },
  FINISHED: { color: 'success', label: 'FINISHED', valueNumber: 2 }
}

export const listTaskStatusSelect: ObjectSelectType[] = [
  new ObjectSelectType({ value: 'NOT_STARTED_YET', lable: 'NOT YET', valueNumber: 0 }),
  new ObjectSelectType({ value: 'WORKING', lable: 'WORKING', valueNumber: 1 }),
  new ObjectSelectType({ value: 'FINISHED', lable: 'FINISHED', valueNumber: 2 })
]

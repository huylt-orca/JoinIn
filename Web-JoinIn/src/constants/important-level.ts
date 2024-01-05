import { ObjectSelectType } from 'src/models/common/ObjectSelectType'
import { StatusObj } from './task-status'

export const importantLevel: StatusObj = {
  OPTIONAL: { color: 'info', label: 'OPTIONAL', value: 'OPTIONAL', valueNumber: 0 },
  LOW: { color: 'success', label: 'LOW', value: 'LOW', valueNumber: 1 },
  MEDIUM: { color: 'warning', label: 'MEDIUM', value: 'MEDIUM', valueNumber: 2 },
  HIGH: { color: 'primary', label: 'HIGH', value: 'HIGH', valueNumber: 3 },
  VERY_HIGH: { color: 'error', label: 'VERY HIGH', value: 'VERY_HIGH', valueNumber: 4 }
}

export const importantLevelList: ObjectSelectType[] = [
  new ObjectSelectType({ value: 'OPTIONAL', lable: 'OPTIONAL', valueNumber: 0 }),
  new ObjectSelectType({ value: 'LOW', lable: 'LOW', valueNumber: 1 }),
  new ObjectSelectType({ value: 'MEDIUM', lable: 'MEDIUM', valueNumber: 2 }),
  new ObjectSelectType({ value: 'HIGH', lable: 'HIGH', valueNumber: 3 }),
  new ObjectSelectType({ value: 'VERY_HIGH', lable: 'VERY HIGH', valueNumber: 4 })
]

import { GroupRequest } from 'src/models/query-models/GroupRequest'
import { ObjValidation, ValueValidation } from '../validation'

export function groupValidation(value: any): GroupRequest | any {
  const result: ObjValidation = {}
  let isError = false

  result.Name = new ValueValidation({ key: 'Name', value: value['Name'] }).required().length(3, 100)
  isError = isError ? true : result.Name.isError

  result.SchoolName = new ValueValidation({ key: 'SchoolName', value: value['SchoolName'] }).length(1, 100)
  isError = isError ? true : result.SchoolName.isError

  result.ClassName = new ValueValidation({ key: 'ClassName', value: value['ClassName'] }).length(1, 100)
  isError = isError ? true : result.ClassName.isError

  result.SubjectName = new ValueValidation({ key: 'SubjectName', value: value['SubjectName'] }).length(1, 100)
  isError = isError ? true : result.SubjectName.isError

  if (isError) {
    return {
      result: result,
      isError: isError
    }
  } else {
    return value as GroupRequest
  }
}

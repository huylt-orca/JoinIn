import { ObjValidation, ValueValidation } from '../validation'

export function taskValidation(value: any) {
  const result: ObjValidation = {}
  let isError = false

  result.name = new ValueValidation({ key: 'Task name', value: value['name'] }).required().length(3, 100)
  isError = isError ? true : result.name.isError

  result.startDateDeadline = new ValueValidation({ key: 'Start date', value: value['startDateDeadline'] }).required()
  isError = isError ? true : result.startDateDeadline.isError

  result.endDateDeadline = new ValueValidation({
    key: 'End date',
    value: value['endDateDeadline']
  })
    .required()
    .isDayAfter(value['startDateDeadline'])
  isError = isError ? true : result.endDateDeadline.isError

  result.estimatedDays = new ValueValidation({ key: 'Estimate days', value: value['estimatedDays'] })
    .required()
    .checkCountDaysBetween2Day(value['startDateDeadline'], value['endDateDeadline'])
  isError = isError ? true : result.estimatedDays.isError

  result.impotantLevel = new ValueValidation({ key: 'Important level', value: value['impotantLevel'] }).required()
  isError = isError ? true : result.impotantLevel.isError

  // result.description = new ValueValidation({ key: 'Description', value: value['description'] }).required()
  // isError = isError ? true : result.description.isError

  if (isError) {
    return {
      result: result,
      isError: isError
    }
  } else {
    return value
  }
}

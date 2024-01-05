import { ObjValidation, ValueValidation } from '../validation'

export function validateProfile(value: any) {
  const result: ObjValidation = {}
  let isError = false

  result.phoneNumber = new ValueValidation({ key: 'Phone number', value: value['phoneNumber'] }).phone().required()
  isError = isError ? true : result.phoneNumber.isError

  result.fullName = new ValueValidation({ key: 'Full name', value: value['fullName'] }).required().length(8, 50)
  isError = isError ? true : result.fullName.isError

  result.birthDay = new ValueValidation({ key: 'Birthday', value: value['birthDay'] }).age(15, 100)
  isError = isError ? true : result.birthDay.isError

  result.description = new ValueValidation({ key: 'Description', value: value['description'] })
    .required()
    .length(8, undefined)
  isError = isError ? true : result.description.isError

  result.majorIdList = new ValueValidation({ key: 'Major(s)', value: value['majorIdList'] })
    .required()
    .length(1, undefined)
  isError = isError ? true : result.majorIdList.isError

  result.skill = new ValueValidation({ key: 'Skill', value: value['skill'] }).required().length(5, 100)
  isError = isError ? true : result.skill.isError

  result.otherContact = new ValueValidation({ key: 'Orther contact', value: value['otherContact'] })
    .required()
    .length(1, 100)
  isError = isError ? true : result.otherContact.isError

  if (isError) {
    return {
      result: result,
      isError: isError
    }
  } else {
    return value
  }
}

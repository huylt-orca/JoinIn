import { ObjValidation, ValueValidation } from '../validation'

export function validateUpdatePassword(value: {
  newPassword: string
  confirmPassword: string
  verifyToken: string
}): any {
  const result: ObjValidation = {}
  let isError = false

  result.newPassword = new ValueValidation({ key: 'New password', value: value.newPassword })
    .required()
    .isPassword()
    .length(3, 100)
  isError = isError ? true : result.newPassword.isError

  result.confirmPassword = new ValueValidation({ key: 'Confirm password', value: value.newPassword })
    .required()
    .isPassword()
    .length(3, 100)
    .checkMatch(result.newPassword)
  isError = isError ? true : result.confirmPassword.isError

  result.verifyToken = new ValueValidation({ key: 'Verify code', value: value.verifyToken }).required()
  isError = isError ? true : result.verifyToken.isError

  if (isError) {
    return {
      isError: isError,
      result: result
    }
  } else {
    return value
  }
}

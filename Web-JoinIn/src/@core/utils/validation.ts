import moment from 'moment'
import { StorageKeys } from 'src/constants'

export interface ObjValidation {
  [key: string]: ValueValidation
}

const getMessageLengthError = (key: string, minLength?: number, maxLength?: number) => {
  if (minLength && maxLength) return `Length of ${key} must from ${minLength} to ${maxLength} characters.`

  if (minLength) return `Length of ${key} must greater than ${minLength} characters.`

  return `Length of ${key} must less than ${minLength} characters.`
}

const getMessageAgeError = (minAge?: number, maxAge?: number) => {
  if (minAge && maxAge) return `Age must from ${minAge} to ${maxAge} years old.`

  if (minAge) return `Age must greater than ${maxAge} years old.`

  return `Age must less than ${minAge} years old.`
}

const getMessageRequired = (key: string) => {
  return `${key} is required.`
}

function calculateNumOfDays(start: string, end: string): number {
  const a = moment(start)
  const b = moment(end)

  return a.diff(b, 'days') + 1
}

export class ValueValidation {
  value: any | any[]
  error: string
  isError: boolean
  key: string

  constructor(valueValidate?: Partial<ValueValidation>) {
    this.value = valueValidate?.value || null
    this.error = valueValidate?.error || ''
    this.isError = valueValidate?.isError || false
    this.key = valueValidate?.key || ''
  }

  length(minLength?: number, maxLength?: number): ValueValidation {
    const message = getMessageLengthError(this.key, minLength, maxLength)

    if ((minLength && this.value?.length < minLength) || (maxLength && this.value?.length > maxLength)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : message,
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  required(): ValueValidation {
    if (this.value === undefined || this.value === null || this.value.length === 0) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : getMessageRequired(this.key),
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  email(): ValueValidation {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.value)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : 'Email is invalid.',
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  age(minAge?: number, maxAge?: number) {
    const currentYear: number = moment().year()
    const birthDay: number = moment(this.value).year()

    const age = currentYear - birthDay

    if ((maxAge && age > maxAge) || (minAge && age < minAge)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : getMessageAgeError(minAge, maxAge),
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  phone() {
    if (/^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(this.value)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : this.isError ? this.error : '',
        isError: this.isError
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : 'Phone is invalid.',
      isError: true
    })
  }

  isDayAfter(start: string) {
    if (!moment(this.value).isAfter(start)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : 'End date must after start date',
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  checkCountDaysBetween2Day(start: string, end: string) {
    if (this.value <= 0) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : `${this.key} must greater than 0.`,
        isError: true
      })
    }

    const diff = calculateNumOfDays(end, start)
    if (this.value > diff) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError
          ? this.error
          : `${this.key} must from ${diff} (${moment(start).format(StorageKeys.KEY_FORMAT_DATE)} to ${moment(
              end
            ).format(StorageKeys.KEY_FORMAT_DATE)})`,
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  checkMatch(x: ValueValidation) {
    if (this.value !== x.value) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : `${this.key} must match ${x.key.toLowerCase()}.`,
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  isPassword() {
    if ((this.value as string)?.indexOf(' ') !== -1) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : `${this.key} must do not contain a whitespace.`,
        isError: true
      })
    }

    if ((/[a-z]/.test(this.value) || /[A-Z]/.test(this.value)) && /[0-9]/.test(this.value)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : '',
        isError: this.isError
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : `${this.key} must contain at least one letter and one number.`,
      isError: true
    })
  }
}

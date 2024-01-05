export class ObjectSelectType {
  private _value: string | number | undefined
  private _lable: string | undefined
  private _valueNumber: number | undefined

  constructor(value: Partial<ObjectSelectType>) {
    this.lable = value?.lable
    this.value = value?.value
    this.valueNumber = value?.valueNumber
  }

  get value() {
    return this._value
  }

  set value(val: string | number | undefined) {
    this._value = val
  }

  get lable() {
    return this._lable
  }

  set lable(val: string | undefined) {
    this._lable = val
  }

  get valueNumber() {
    return this._valueNumber
  }

  set valueNumber(val: number | undefined) {
    this._valueNumber = val
  }
}

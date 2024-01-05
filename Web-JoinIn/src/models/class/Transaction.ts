import { User } from './index'

export class Transaction {
  private _id: string | undefined
  private _transactionDate: Date | string | undefined
  private _createdDate: Date | string | undefined
  private _status: 'WAITING' |'SUCCESS' | 'FAIL' | 'CANCELED' | undefined | 0 | 1 | 2 | 3
  private _type: string | undefined
  private _userId: string | undefined
  private _transactionCode: string | undefined
  private _user: User | undefined

  constructor(value: Partial<Transaction>) {
    this.id = value?.id
    this.transactionCode = value?.transactionCode
    this.createdDate = value?.createdDate
    this.transactionDate = value?.transactionDate
    this.status = value?.status
    this.type = value?.type
    this.userId = value?.userId
    this.user = value?.user
  }

  get id() {
    return this._id
  }

  set id(val: string | undefined) {
    this._id = val
  }

  get transactionCode() {
    return this._id
  }

  set transactionCode(val: string | undefined) {
    this._id = val
  }

  get transactionDate() {
    return this._transactionDate
  }

  set transactionDate(val: Date | string | undefined) {
    this._transactionDate = val
  }

  get createdDate() {
    return this._createdDate
  }

  set createdDate(val: Date | string | undefined) {
    this._createdDate = val
  }

  get status() {
    switch(this._status){
      case 0:
        return 'WAITING'
      case 1:
        return 'SUCCESS'
      case 2:
        return 'FAIL'
      case 3:
        return 'CANCELED'
      default:
      return this._status
    }
  }

  set status(val: 'WAITING' |'SUCCESS' | 'FAIL' | 'CANCELED' | undefined | 0 | 1 | 2 | 3) {
    this._status = val
  }

  get type() {
    return this._type
  }

  set type(val: string | undefined) {
    this._type = val
  }

  get userId() {
    return this._userId
  }

  set userId(val: string | undefined) {
    this._userId = val
  }

  get user() {
    return this._user
  }

  set user(val: User | undefined) {
    this._user = val
  }
}

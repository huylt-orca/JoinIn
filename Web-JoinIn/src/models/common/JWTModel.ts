export class JWTModel {
  private _Id: string | undefined
  private _TokenId: string | undefined
  private _aud: string | undefined
  private _exp: string | undefined
  private _iat: string | undefined
  private _iss: string | undefined
  private _name: string | undefined
  private _nbf: string | undefined
  private _role: string | undefined

  get Id() {
    return this._Id
  }

  set Id(val: string | undefined) {
    this._Id = val
  }

  get TokenId() {
    return this._TokenId
  }

  set TokenId(val: string | undefined) {
    this._TokenId = val
  }

  get aud() {
    return this._aud
  }

  set aud(val: string | undefined) {
    this._aud = val
  }

  get exp() {
    return this._exp
  }

  set exp(val: string | undefined) {
    this._exp = val
  }

  get iat() {
    return this._iat
  }

  set iat(val: string | undefined) {
    this._iat = val
  }

  get iss() {
    return this._iss
  }

  set iss(val: string | undefined) {
    this._iss = val
  }

  get name() {
    return this._name
  }

  set name(val: string | undefined) {
    this._name = val
  }

  get nbf() {
    return this._nbf
  }

  set nbf(val: string | undefined) {
    this._nbf = val
  }

  get role() {
    return this._role
  }

  set role(val: string | undefined) {
    this._role = val
  }

  constructor(value?: Partial<JWTModel>) {
    this.Id = value?.Id
    this.TokenId = value?.TokenId
    this.aud = value?.aud
    this.exp = value?.exp
    this.iat = value?.iat
    this.iss = value?.iss
    this.name = value?.name
    this.nbf = value?.nbf
    this.role = value?.role
  }
}

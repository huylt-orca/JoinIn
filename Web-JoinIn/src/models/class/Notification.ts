export class Notification {
  id: string
  image: string | undefined
  message: string | undefined
  link: string | undefined
  status: number
  type: number
  createdDate: string | undefined
  userId: string | undefined
  name: string | undefined

  constructor(value: any | Partial<Notification>) {
    this.id = value?.id || value?.Id || ''
    this.image = value?.image || value?.Image
    this.message = value?.message || value?.Message
    this.link = value?.link || value?.Link
    this.status = value?.status || value?.Status || 0
    this.type = value?.type || value?.Type || 0
    this.createdDate = value?.createdDate || value?.CreatedDate
    this.userId = value?.userId || value?.UserId
    this.name = value?.name
  }
}

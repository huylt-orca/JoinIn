import { GroupRenderType } from 'src/constants'

export type GroupRenderProps = {
  renderType: typeof GroupRenderType[keyof typeof GroupRenderType]
  handleError?: (error: any) => void
}

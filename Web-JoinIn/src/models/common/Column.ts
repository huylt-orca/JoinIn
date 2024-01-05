import { ReactNode } from 'react'

export interface Column {
  id: string
  label: string
  minWidth?: number
  align?: 'right' | 'center' | 'left'
  format?: (value: any) => string | ReactNode
}

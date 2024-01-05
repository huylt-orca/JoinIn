import { Fragment } from 'react'
import { TableRow, TableCell, Skeleton } from '@mui/material'

export interface IRowLoadingProps {
  rowNum: number
  column: number
}

const Row = ({ num }: { num: number }) => {
  return (
    <Fragment>
      <TableCell></TableCell>
      {[...Array(num)].map(item => (
        <TableCell key={item}>
          <Skeleton animation='wave' variant='text' />
        </TableCell>
      ))}
    </Fragment>
  )
}

export default function RowLoading({ rowNum, column }: IRowLoadingProps) {
  return (
    <Fragment>
      {[...Array(rowNum)].map(item => (
        <TableRow key={item}>
          <Row num={column - 1} />
        </TableRow>
      ))}
    </Fragment>
  )
}

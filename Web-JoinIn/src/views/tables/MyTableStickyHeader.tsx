// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { Column } from 'src/models/common/Column'
import { Task } from 'src/models/class'
import { taskAPI } from 'src/api-client/task'

export interface IMyTableStickyHeaderProps {
  columns: Column[]
}

export default function MyTableStickyHeader(props: IMyTableStickyHeaderProps) {
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [data, setData] = useState<Task[]>([])
  const { columns } = props

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  useEffect(() => {
    setData(taskAPI.User.getListTodo())
  }, [])

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ height: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ minWidth: '30px' }}>
                Index
              </TableCell>
              {columns?.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const value: any = row

              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={value?.Id}>
                  <TableCell align='center'>{page * rowsPerPage + index + 1}</TableCell>
                  {columns.map(column => {
                    const val = value[column.id]

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(val) : val}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={data?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

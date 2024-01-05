import {
  Box,
  Card,
  InputAdornment,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@mui/material'
import { Magnify } from 'mdi-material-ui'
import * as React from 'react'
import { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import withAuth from '../withAuth'
import { Feedback } from 'src/models/class'
import { QueryFeedbackListModel } from 'src/models/query-models/QueryFeedbackListModel'
import { feedbackAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { useToasts } from 'react-toast-notifications'
import moment from 'moment'
import { StorageKeys } from 'src/constants'

interface Column {
  id: 'rating' | 'createdDate' | 'content'
  label: string
  minWidth?: number
  align?: 'right' | 'center'
  format?: (value: any) => string | ReactNode
}

const columns: Column[] = [
  {
    id: 'rating',
    label: 'Rating',
    minWidth: 100,
    align: 'center',
    format: (value: number) => <Rating name='read-only' value={value} readOnly precision={0.5} />
  },
  {
    id: 'createdDate',
    label: 'Feedbacked Date',
    minWidth: 200,
    align: 'center',
    format: (value: string) => moment(value).format(StorageKeys.KEY_FORMAT_DATE)
  },
  {
    id: 'content',
    label: 'Content',
    minWidth: 300,
    format: (value: string) => <div className='editor' dangerouslySetInnerHTML={{ __html: value }} />
  }
]

const FeedbackList = () => {
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [listFeedback, setListFeedback] = useState<Feedback[]>([])

  const addToast = useToasts()

  useEffect(() => {
    getListFeedback()
  }, [page, rowsPerPage])

  const getListFeedback = async () => {
    try {
      const payload: QueryFeedbackListModel = {
        orderBy: '',
        page: page + 1,
        pageSize: rowsPerPage,
        value: ''
      }

      await feedbackAPI
        .getList(payload)
        .then(res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
          setTotalItems(data.pagination?.total ?? 0)
          const feedbacks: Feedback[] = data.data

          setListFeedback(feedbacks)
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Card>
      <Box
        sx={{
          ml: 4,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          padding: '15px'
        }}
      >
        <TextField
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <TableContainer sx={{ height: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ minWidth: '20px' }}>
                Index
              </TableCell>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {listFeedback.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                  <TableCell align='center' sx={{ minWidth: '20px' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}

                        {/* {value} */}
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
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  )
}

export default withAuth(FeedbackList)

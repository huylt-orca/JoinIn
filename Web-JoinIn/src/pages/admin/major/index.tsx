import {
  CardHeader,
  Box,
  Card,
  TextField,
  FormControl,
  Button,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Grid,
  Modal,
  Fade,
  CardActions,
  Typography,
  IconButton,
  Backdrop,
  CircularProgress
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { Column } from 'src/models/common/Column'
import withAuth from 'src/pages/withAuth'
import { QueryMajorListModel } from 'src/models/query-models/QueryMajorListModel'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import { majorAPI } from 'src/api-client'
import { Major } from 'src/models/class'
import { Cancel, ContentSave, Close } from 'mdi-material-ui'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4
}

const ModalAddEditMAjor = ({
  data,
  modalOpen,
  handleCloseModal,
  fetchMajors
}: {
  data?: Major
  modalOpen: boolean
  handleCloseModal: () => void
  fetchMajors: () => void
}) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [major, setMajor] = useState<Major>()
  const router = useRouter()
  const addToast = useToasts()

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    setEdit(data !== undefined)
    setMajor(data)
  }, [data, modalOpen])

  const handleSaveMajor = () => {
    if (edit) {
      major &&
        majorAPI
          .updateMajor(major)
          .then(response => {
            fetchMajors()
            notify(new CommonResponse(response).data.message, 'success')
            handleCloseModal()
          })
          .catch(error => handleError(error))
    } else {
      major &&
        majorAPI
          .addNewMajor(major)
          .then(response => {
            fetchMajors()
            notify(new CommonResponse(response).data.message, 'success')
            handleCloseModal()
          })
          .catch(error => handleError(error))
    }
  }

  const handleError = (error: any) => {
    const dataErr = (error as AxiosError)?.response
    if (dataErr?.status === 401) {
      notify('Login expired.', 'error')
      router.push('/user/logout')
    } else if (dataErr?.status === 500) {
      if (error?.response?.data?.message) notify(error?.response?.data?.message, 'error')
      else notify('Something error', 'error')
    } else {
      console.log(error)
    }
  }

  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      closeAfterTransition
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
    >
      <Fade in={modalOpen}>
        <Card sx={{ ...style, width: 450 }} className='modal-size'>
          <CardHeader
            title={
              <>
                <Typography textAlign={'left'} fontWeight={600} pt={0}>
                  {edit ? 'Edit major' : 'Add new major'}
                </Typography>
                <IconButton
                  aria-label='close'
                  onClick={handleCloseModal}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme => theme.palette.grey[500]
                  }}
                >
                  <Close />
                </IconButton>
              </>
            }
            sx={{
              paddingTop: 0
            }}
          />
          <CardContent>
            <Grid container flexDirection={'column'} justifyContent={'center'} spacing={5}>
              <Grid item>
                <FormControl fullWidth>
                  <TextField
                    value={major?.shortName}
                    label='Key'
                    placeholder='EN'
                    onChange={e => {
                      const newMajor = new Major(major)
                      newMajor.shortName = e.target.value
                      setMajor(newMajor)
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <TextField
                    value={major?.name}
                    label='Name'
                    placeholder='English'
                    onChange={e => {
                      const newMajor = new Major(major)
                      newMajor.name = e.target.value
                      setMajor(newMajor)
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Button
              color='success'
              startIcon={<ContentSave />}
              variant='outlined'
              size='small'
              onClick={handleSaveMajor}
            >
              Save
            </Button>
            <Button onClick={handleCloseModal} color='error' startIcon={<Cancel />} variant='outlined' size='small'>
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  )
}

const MajorManagePage = () => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [data, setData] = useState<Major[]>([])
  const [queryMajors, setQueryMajors] = useState<QueryMajorListModel>(new QueryMajorListModel())
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [newMajor, setNewMajor] = useState<Major>()
  const addToast = useToasts()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const columns: Column[] = [
    {
      id: 'shortName',
      label: 'Key',
      align: 'left'
    },
    {
      id: 'name',
      label: 'Name',
      align: 'left'
    }
  ]

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    setIsLoading(true)
    fetchMajors()
  }, [])

  const fetchMajors = async (query?: QueryMajorListModel) => {
    const queryFetch = query ?? queryMajors

    await majorAPI
      .getList(queryFetch)
      .then(commonMajors => {
        const common = new CommonResponse(commonMajors)
        setQueryMajors({
          page: common.pagination?.currentPage ?? 1,
          pageSize: common.pagination?.pageSize ?? 10,
          total: common.pagination?.total ?? 0
        } as QueryMajorListModel)
        setData(common.data as Major[])
        setIsLoading(false)
      })
      .catch(error => {
        handleError(error)
      })
  }

  const handleError = (error: any) => {
    const dataErr = (error as AxiosError)?.response
    if (dataErr?.status === 401) {
      notify('Login expired.', 'error')
      router.push('/user/logout')
    } else if (dataErr?.status === 500) {
      if (error?.response?.data?.message) notify(error?.response?.data?.message, 'error')
      else notify('Something error', 'error')
    } else {
      console.log(error)
    }
  }

  // const handleCheckRowIndex = (event: any, id: string) => {
  //   const selectedRows = [...rowsSelected]
  //   if (event.target.checked) {
  //     selectedRows.push(id)
  //   } else {
  //     selectedRows.splice(rowsSelected.indexOf(id), 1)
  //   }

  //   setRowsSelected(selectedRows)
  // }

  // const handleCheckAllRow = (event: any) => {
  //   if (event.target.checked) {
  //     const list: any[] = []
  //     data?.map(value => list.push(value.id ?? -1))
  //     setRowsSelected(list)
  //   } else {
  //     setRowsSelected([])
  //   }
  // }

  const changeSearchValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.target.value &&
      setQueryMajors(
        new QueryMajorListModel({
          ...queryMajors,
          name: event.target.value
        } as QueryMajorListModel)
      )

    setSearchValue(event.target.value)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setQueryMajors(
      new QueryMajorListModel({
        ...queryMajors,
        currentPage: newPage
      } as QueryMajorListModel)
    )
    fetchMajors({
      ...queryMajors,
      currentPage: newPage
    } as QueryMajorListModel)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryMajors(
      new QueryMajorListModel({
        ...queryMajors,
        currentPage: 1,
        pageSize: +event.target.value
      } as QueryMajorListModel)
    )
    fetchMajors(
      new QueryMajorListModel({
        ...queryMajors,
        currentPage: 1,
        pageSize: +event.target.value
      } as QueryMajorListModel)
    )
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setNewMajor(undefined)
  }

  const handleClickEdit = (data: Major | any) => {
    setModalOpen(true)
    setNewMajor(new Major(data))
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box>
            <Grid container spacing={1} justifyContent={'space-around'}>
              <Grid item sm={5} md={4}>
                <FormControl fullWidth>
                  <TextField
                    id='form-input-search-value'
                    placeholder='email123@gmail.com'
                    label={'Search by name'}
                    value={searchValue}
                    onChange={e => changeSearchValue(e)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        fetchMajors()
                      }
                    }}
                    size='small'
                  />
                </FormControl>
              </Grid>
              <Grid item container sm={7} md={8} spacing={0.5} justifyContent={'flex-end'}>
                <Grid item>
                  <Button
                    size='small'
                    variant='outlined'
                    color='info'
                    sx={{ m: 1 }}
                    onClick={() => {
                      setModalOpen(true)
                    }}
                  >
                    Add new
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        }
      />
      <CardContent>
        <TableContainer sx={{ height: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {/* <TableCell align='center' padding='none' width={20}>
                  <Checkbox onChange={handleCheckAllRow} checked={rowsSelected.length === data.length} />
                </TableCell> */}
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
              {data?.map((row, index) => {
                const rowData: any = row

                return (
                  <TableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={rowData?.Id}
                    sx={{
                      cursor: 'pointer'
                    }}
                    onClick={() => handleClickEdit(rowData)}
                  >
                    {/* <TableCell align='center' padding='none' width={20}>
                      <Checkbox
                        onChange={e => handleCheckRowIndex(e, row.id ?? '')}
                        checked={rowsSelected.indexOf(row.id ?? '') !== -1}
                      />
                    </TableCell> */}
                    <TableCell align='center'>{(queryMajors.page - 1) * queryMajors.pageSize + index + 1}</TableCell>
                    {columns.map(column => {
                      const value = rowData[column.id]

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value) : value}
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
          rowsPerPageOptions={[1, 10, 25, 100]}
          component='div'
          count={queryMajors.total}
          rowsPerPage={queryMajors.pageSize}
          page={queryMajors.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
      <ModalAddEditMAjor
        data={newMajor}
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        fetchMajors={fetchMajors}
      />

      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default withAuth(MajorManagePage)

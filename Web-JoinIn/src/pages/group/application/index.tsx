// ** React Imports
import { useState, ChangeEvent, ReactNode, useEffect, KeyboardEvent } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Typography,
  Grid,
  Avatar,
  Modal
} from '@mui/material'
import { Close, DotsHorizontal, Magnify } from 'mdi-material-ui'
import RecruitmentForm from 'src/views/group/application/RecruitmentForm'
import { StatusObj } from 'src/constants/task-status'
import AvatarName from 'src/layouts/components/AvatarName'
import { useToasts } from 'react-toast-notifications'
import { applicationAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { Application } from 'src/models/class'
import { ApplicationStatus } from 'src/constants/application-status'
import { QueryApplicationListModel } from 'src/models/query-models/QueryApplicationListModel'
import { groupDBDexie } from 'src/models/db/GroupDB'
import moment from 'moment'
import { StorageKeys } from 'src/constants'
import ProfileView from 'src/views/profile/ProfileView'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import UserGroupLayout from 'src/layouts/UserGroupLayout'

interface Column {
  id: 'name' | 'position' | 'createddate' | 'description' | 'status' | 'confirmeddate'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: any) => string | ReactNode
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 200 },
  { id: 'position', label: 'Position', minWidth: 100 },
  {
    id: 'createddate',
    label: 'Created Date',
    minWidth: 100,
    format: (value: string) => moment(value).format(StorageKeys.KEY_FORMAT_DATE)
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    format: (value: any) => (
      <Chip
        label={value}
        color={statusObj[value].color}
        sx={{
          height: 24,
          fontSize: '0.75rem',
          textTransform: 'capitalize',
          '& .MuiChip-label': { fontWeight: 500 }
        }}
      />
    )
  },
  {
    id: 'confirmeddate',
    label: 'Confirmed Date',
    minWidth: 100,
    format: (value: string) => moment(value).format(StorageKeys.KEY_FORMAT_DATE)
  }
]

const statusObj: StatusObj = {
  APPROVED: { color: 'success' },
  DISAPPROVED: { color: 'error' },
  WAITING: { color: 'warning' }
}

const ApplicationScreen = () => {
  const addToast = useToasts()
  const router = useRouter()

  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [openPopupApplication, setOpenPopupApplication] = useState(false)
  const [updateUI, setUpdateUI] = useState<boolean>(true)
  const [listApplications, setListApplications] = useState<any[]>([])
  const [selectedRow, setSelectedRow] = useState<any>()
  const [searchName, setSearchName] = useState<string>('')
  const [storeSearchName, setStoreSearchName] = useState<string>('')
  const [modalProfileOpen, setModalProfileOpen] = useState(false)

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    getListApplication()
  }, [storeSearchName, page, rowsPerPage, updateUI])

  const handleRejectApplication = async () => {
    try {
      await applicationAPI
        .putApplication({ applicationId: selectedRow?.id, status: ApplicationStatus.DISAPPROVED })
        .then(res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
        })
        .catch(err => {
          console.log(err)
        })
      handlePopupApplication()
      setUpdateUI(!updateUI)
    } catch (err) {
      console.log(err)
    }
  }

  const handleAcceptApplication = async () => {
    try {
      await applicationAPI
        .putApplication({ applicationId: selectedRow?.id, status: ApplicationStatus.APPROVED })
        .then(res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
        })
        .catch(err => {
          console.log(err)
        })
      handlePopupApplication()
      setUpdateUI(!updateUI)
    } catch (err) {
      console.log(err)
    }
  }

  const handleClickSearch = () => {
    setStoreSearchName(searchName)
  }

  const handleEnterSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log(event.currentTarget.value)
      setStoreSearchName(searchName)
    }
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value)
  }

  const handleClickPopupApplication = () => {
    setOpenPopupApplication(true)
  }

  const handlePopupApplication = () => {
    setOpenPopupApplication(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleOptionsClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const handleViewDetail = (row?: any) => {
    // Handle view detail action
    row?.id && setSelectedRow(row)
    handleClickPopupApplication()

    // handleOptionsClose()
  }

  const handleViewProfile = (row?: any) => {
    // Handle change status action
    row?.id && setSelectedRow(row)
    setModalProfileOpen(true)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const getListApplication = async () => {
    try {
      const groupData = await groupDBDexie.getGroup()
      const payload: QueryApplicationListModel = {
        groupId: groupData?.id,
        name: storeSearchName,
        majorIdsString: '',
        orderBy: '',
        page: page + 1,
        pageSize: rowsPerPage,
        value: ''
      }

      await applicationAPI
        .getList(payload)
        .then(res => {
          const data = new CommonResponse(res)

          addToast.addToast(data.message, { appearance: 'success' })
          setTotalItems(data.pagination?.total ?? 0)
          const applications: Application[] = data.data.map((application: Application) => new Application(application))

          const list = applications.map(application => ({
            id: application.id,
            avatar: application.user?.avatar,
            name: application.user?.fullName,
            position: application.applicationMajors?.at(0)?.major?.name,
            createddate: application.createdDate,
            description: application.description,
            status: application.status,
            confirmeddate: application.confirmedDate,
            userId: application.userId
          }))
          setListApplications(list)
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
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
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
          placeholder='Search by name'
          onChange={handleSearch}
          onKeyDown={handleEnterSearch}
          value={searchName}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' onClick={handleClickSearch} />
              </InputAdornment>
            )
          }}
        />
        <Button size='small' variant='contained' sx={{ marginRight: '20px' }} onClick={handleClickOpen}>
          Recruitment
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <DialogTitle>Recruitment</DialogTitle>
            <DialogActions>
              <Button onClick={handleClose}>
                <Close sx={{ color: 'red' }} />
              </Button>
            </DialogActions>
          </Box>
          <DialogContent>
            <RecruitmentForm />
          </DialogContent>
        </Dialog>
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
              <TableCell align='right'>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listApplications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  key={row.id}

                  // onClick={() => handleViewDetail(row)}
                >
                  <TableCell align='center' sx={{ minWidth: '20px' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {/* {column.format && typeof value === 'string' ? column.format(value) : value} */}
                        {column.id === 'name' ? (
                          <AvatarName
                            avatar={row.avatar}
                            title={
                              <a className='link-style' onClick={() => handleViewProfile(row)}>
                                {value}
                              </a>
                            }
                          />
                        ) : (
                          <div>{column.format && typeof value === 'string' ? column.format(value) : value}</div>
                        )}
                      </TableCell>
                    )
                  })}
                  <TableCell align='right'>
                    <IconButton onClick={event => handleOptionsClick(event, row)}>
                      <DotsHorizontal />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <MenuItem onClick={handleViewDetail}>View Application</MenuItem>
          <MenuItem onClick={() => handleViewProfile(selectedRow)}>View Profile</MenuItem>
        </Menu>
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

      <Dialog
        open={openPopupApplication}
        onClose={handlePopupApplication}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle>Application</DialogTitle>
          <DialogActions>
            <Button onClick={handlePopupApplication}>
              <Close sx={{ color: 'red' }} />
            </Button>
          </DialogActions>
        </Box>
        <DialogContent>
          <form>
            <Grid container spacing={7}>
              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <Avatar src={selectedRow?.avatar} alt='Profile Pic' sx={{ width: 120, height: 120 }} />
                  <Typography variant='h5'>{selectedRow?.name}</Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
          <Typography mt={7}>Position: {selectedRow?.position}</Typography>
          <Typography mt={7}>Submission date: {selectedRow?.createddate}</Typography>
          <Typography mt={7}>Description:
          <div className='editor' dangerouslySetInnerHTML={{ __html: selectedRow?.description }} />
          </Typography>
          <Typography mt={7}>
            <b>{selectedRow?.name}</b> want to join group <b>EXE</b>. Do you want to?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box display='flex' justifyContent='center' width='100%'>
            <Button
              onClick={handleRejectApplication}
              variant='outlined'
              color='error'
              sx={{ mr: 10 }}
              disabled={selectedRow?.status !== 'WAITING'}
            >
              Reject
            </Button>
            <Button
              onClick={handleAcceptApplication}
              autoFocus
              variant='contained'
              color='success'
              disabled={selectedRow?.status !== 'WAITING'}
            >
              Accept
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Modal
        open={modalProfileOpen}
        onClose={() => setModalProfileOpen(false)}
        sx={{
          maxWidth: '80%',
          minWidth: '50%',
          overflow: 'auto',
          backgroundColor: '#FFFFFF',
          top: '10%',
          bottom: '10%',
          left: '10%',
          right: '10%',
          borderRadius: '5px'
        }}
        closeAfterTransition
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
      >
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '10px'
          }}
        >
          <ProfileView handleError={handleError} userId={selectedRow?.userId} />
        </Box>
      </Modal>
    </Paper>
  )
}

ApplicationScreen.getLayout = (page: ReactNode) => <UserGroupLayout>{page}</UserGroupLayout>

export default ApplicationScreen

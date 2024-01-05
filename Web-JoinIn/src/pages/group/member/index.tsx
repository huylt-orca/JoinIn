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
  DialogContentText,
  Typography,
  Grid,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Modal,
  Backdrop,
  CircularProgress
} from '@mui/material'
import { Account, Close, CommentQuote, DotsHorizontal, ExitToApp, InformationVariant, Magnify } from 'mdi-material-ui'
import InviteForm from 'src/views/group/member/InviteForm'
import { StatusObj } from 'src/constants/task-status'
import AvatarName from 'src/layouts/components/AvatarName'
import { useRouter } from 'next/router'
import withAuth from 'src/pages/withAuth'
import { groupAPI, memberAPI } from 'src/api-client'
import { useToasts } from 'react-toast-notifications'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { Member } from 'src/models/class'
import { GroupDBType, groupDBDexie } from 'src/models/db/GroupDB'
import FeedbackForm from 'src/views/feedback/FeedbackForm'
import moment from 'moment'
import { StorageKeys } from 'src/constants'
import { getMemberRoleValueNumber } from 'src/constants/member-role'
import ProfileView from 'src/views/profile/ProfileView'
import { AxiosError } from 'axios'
import UserGroupLayout from 'src/layouts/UserGroupLayout'
import { userDBDexie } from 'src/models/db/UserDB'

interface Column {
  id: 'name' | 'role' | 'major' | 'joindate' | 'status'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: any) => string | ReactNode
}

const optionsRole = [
  { value: 'LEADER', label: 'Leader' },
  { value: 'SUB_LEADER', label: 'Sub Leader' },
  { value: 'MEMBER', label: 'Member' }
]

const statusObj: StatusObj = {
  ACTIVE: { color: 'info' },
  OUT: { color: 'error' }
}

const MemberPage = () => {
  const router = useRouter()
  const addToast = useToasts()

  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<any>()

  const [open, setOpen] = useState(false)
  const [openFeedback, setOpenFeedback] = useState(false)
  const [openAlertDelete, setOpenAlertDelete] = useState(false)
  const [modalProfileOpen, setModalProfileOpen] = useState(false)

  const [openPopupChangeRole, setOpenPopupChangeRole] = useState(false)
  const [listMembers, setListMember] = useState<any[]>([])
  const [selectedRole, setSelectedRole] = useState<any>({
    value: '',
    label: ''
  })
  const [updateUI, setUpdateUI] = useState(false)
  const [searchName, setSearchName] = useState<string>('')
  const [storeSearchName, setStoreSearchName] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userInfor, setUserInfor] = useState<any>({
    id: '',
    role: ''
  })
  const [groupInfor, setGroupInfor] = useState<GroupDBType>()

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  const columns: Column[] = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 200,
      format: (value: any) => <AvatarName avatar={value.avatar} title={value.name} />
    },
    { id: 'role', label: 'Role', minWidth: 100 },
    {
      id: 'major',
      label: 'Major',
      minWidth: 100
    },
    {
      id: 'joindate',
      label: 'Join Date',
      minWidth: 100,
      format: (value: string) => moment(value).format(StorageKeys.KEY_FORMAT_DATE)
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 200,
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
    }
  ]

  useEffect(() => {
    getUserInfor()
    getListMember()
  }, [updateUI, storeSearchName])

  const getUserInfor = async () => {
    const userData = await userDBDexie.getUser()
    const groupData = await groupDBDexie.getGroup()
    groupData && setGroupInfor(groupData)
    try {
      await groupAPI.getRoleInGroup(groupData?.id ?? '').then(res => {
        const data = new CommonResponse(res)
        setUserInfor({
          id: userData?.id,
          role: data.data
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChangeRole = (event: SelectChangeEvent<string>) => {
    setSelectedRole({
      value: event.target.value,
      label: optionsRole.find(option => option.value === event.target.value)?.label
    })
  }

  const handleSubmitChangeRole = () => {
    if (selectedRole.value !== '' && selectedRow?.role !== selectedRole.value) {
      changeRoleMember()
      handlePopupChangeRole()
    }
  }

  const changeRoleMember = async () => {
    try {
      const groupData = await groupDBDexie.getGroup()

      const member: any = {
        role: getMemberRoleValueNumber(selectedRole.value),
        groupId: groupData?.id,
        memberId: selectedRow?.id
      }

      await memberAPI
        .put(member)
        .then(async res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
          setUpdateUI(!updateUI)
        })
        .catch(error => {
          console.log('Member Form: ', error)
        })
    } catch (e) {
      console.log('Member Form: ', e)
    }
  }

  const handleClickSearch = () => {
    setStoreSearchName(searchName)
  }

  const handleEnterSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setStoreSearchName(searchName)
    }
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value)
  }

  const handleClickPopupChangeRole = () => {
    setOpenPopupChangeRole(true)
  }

  const handlePopupChangeRole = () => {
    setOpenPopupChangeRole(false)
    handleOptionsClose()
  }

  const handleClickOpenAlertDelete = () => {
    setOpenAlertDelete(true)
  }

  const handleCloseAlertDelete = () => {
    setOpenAlertDelete(false)
  }

  const handleKickOutGroup = () => {
    console.log(reason)
    if (reason !== '') {
      kickOutGroup()
    }
  }

  const kickOutGroup = async () => {
    try {
      setIsLoading(true)
      const dataGroup = await groupDBDexie.getGroup()
      const request: any = {
        memberId: selectedRow?.id,
        description: reason,
        groupId: dataGroup?.id
      }
      await memberAPI
        .kickOut(request)
        .then(res => {
          const data = new CommonResponse(res)
          setUpdateUI(!updateUI)
          setOpenAlertDelete(false)
          addToast.addToast(data.message, { appearance: 'success' })
          handleOptionsClose()
        })
        .catch(err => {
          console.log(err)
        })
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
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

  const handleDelete = () => {
    // Handle delete action
    handleClickOpenAlertDelete()

    // handleOptionsClose()
  }

  const handleViewDetail = (row: any) => {
    // Handle view detail action

    setSelectedRow(row)
    setModalProfileOpen(true)

    // handleOptionsClose()
  }

  const handleChangeStatus = () => {
    // Handle change status action
    handleClickPopupChangeRole()
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleChangeReason = (event: ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value)
  }

  const handleClickOpenFeedback = () => {
    setOpenFeedback(true)
  }

  const handleCloseFeedback = () => {
    setOpenFeedback(false)
  }

  const getListMember = async () => {
    try {
      await memberAPI
        .getList(storeSearchName)
        .then(res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
          const members: Member[] = data.data.map((member: Member) => new Member(member))
          const list = members.map(member => ({
            id: member.id,
            avatar: member.user?.avatar,
            name: member.user?.fullName,
            role: member.role,
            major: member.user?.applications?.at(0)?.applicationMajors?.at(0)?.major?.name,
            joindate: member.joinedDate,
            userId: member.user?.id,
            status: 'ACTIVE'
          }))
          setListMember(list)
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
          Invite
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <DialogTitle>Invite</DialogTitle>
            <DialogActions>
              <Button onClick={handleClose}>
                <Close sx={{ color: 'red' }} />
              </Button>
            </DialogActions>
          </Box>
          <DialogContent>
            <InviteForm onButtonClick={handleClose} />
          </DialogContent>
        </Dialog>
      </Box>

      <Dialog open={openFeedback} onClose={handleCloseFeedback}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle>Open Feedback</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseFeedback}>
              <Close sx={{ color: 'red' }} />
            </Button>
          </DialogActions>
        </Box>

        <DialogContent>
          <FeedbackForm member={selectedRow} onButtonClick={handleCloseFeedback} />
        </DialogContent>
      </Dialog>

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
            {listMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                  <TableCell align='center' sx={{ minWidth: '20px' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {/* {column.format && typeof value === 'string' ? column.format(value) : value} */}
                        {/* {value} */}
                        {column.id === 'name' ? (
                          <AvatarName
                            avatar={row.avatar}
                            title={
                              <a className='link-style' onClick={() => handleViewDetail(row)}>
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
          <MenuItem onClick={handleViewDetail}>
            <InformationVariant fontSize='small' sx={{ mr: 3 }} /> Detail
          </MenuItem>

          {userInfor.role === 'LEADER' && userInfor.id !== selectedRow?.userId ? (
            <MenuItem onClick={handleChangeStatus}>
              <Account fontSize='small' sx={{ mr: 3 }} /> Change Role
            </MenuItem>
          ) : null}
          {userInfor.id !== selectedRow?.userId &&
          userInfor.role === 'LEADER' &&
          selectedRow?.id !== groupInfor?.createdBy ? (
            <MenuItem onClick={handleDelete}>
              <ExitToApp fontSize='small' sx={{ mr: 3 }} /> Kick Out
            </MenuItem>
          ) : null}

          {(userInfor.id !== selectedRow?.userId && selectedRow?.role === 'LEADER' && userInfor.role !== 'LEADER') ||
          (userInfor.role === 'LEADER' && selectedRow?.role !== 'LEADER') ? (
            <MenuItem onClick={handleClickOpenFeedback}>
              <CommentQuote fontSize='small' sx={{ mr: 3 }} /> Feedback
            </MenuItem>
          ) : null}
        </Menu>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[listMembers.length]}
        component='div'
        count={listMembers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog Cofirm Kick out member */}
      <Dialog
        open={openAlertDelete}
        onClose={handleCloseAlertDelete}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Kicked out of the group'}</DialogTitle>
        <DialogContent>
          <TextField
            id='reason'
            label='Reason'
            multiline
            rows={4}
            placeholder='Reason'
            value={reason}
            onChange={handleChangeReason}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' }, mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <InformationVariant />
                </InputAdornment>
              )
            }}
          />
          <DialogContentText id='alert-dialog-description'>
            Do you want to kick <b>{selectedRow?.name}</b> out of the group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertDelete}>Cancel</Button>
          <Button onClick={handleKickOutGroup} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog change role */}
      <Dialog
        open={openPopupChangeRole}
        onClose={handlePopupChangeRole}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Change Role'}</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={7}>
              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <Avatar src={selectedRow?.avatar} alt='Profile Pic' sx={{ width: 120, height: 120 }} />
                  <Typography variant='h5'>{selectedRow?.name}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select label='Role' value={selectedRole.value || selectedRow?.role} onChange={handleChangeRole}>
                    {optionsRole.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
          {selectedRole.value && (
            <Typography mt={7}>
              Do you want to change <b>{selectedRow?.role}</b> to <b>{selectedRole.label}</b>?
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handlePopupChangeRole}>Cancel</Button>
          {selectedRole && (
            <Button onClick={handleSubmitChangeRole} autoFocus>
              Yes
            </Button>
          )}
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

      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Paper>
  )
}

MemberPage.getLayout = (page: ReactNode) => <UserGroupLayout>{page}</UserGroupLayout>

export default withAuth(MemberPage)

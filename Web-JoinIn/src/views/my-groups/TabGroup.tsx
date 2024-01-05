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
  DialogContentText
} from '@mui/material'
import { Close, Delete, DotsHorizontal, ExitToApp, InformationVariant, Magnify } from 'mdi-material-ui'
import { GroupRenderProps } from 'src/type/types'
import { useRouter } from 'next/router'
import GroupForm from './GroupForm'
import AvatarName from 'src/layouts/components/AvatarName'
import { groupAPI, memberAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { useToasts } from 'react-toast-notifications'
import { Group } from 'src/models/class'
import { QueryGroupListModel } from 'src/models/query-models/QueryGroupListModel'
import { groupDBDexie } from 'src/models/db/GroupDB'
import { userDBDexie } from 'src/models/db/UserDB'

interface Column {
  id: 'name' | 'subject' | 'class' | 'member' | 'leader'
  label: string
  minWidth?: number
  align?: 'right' | 'center'
  format?: (value: number) => string | ReactNode
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 200 },

  { id: 'subject', label: 'Subject', minWidth: 100 },

  {
    id: 'member',
    label: 'Member',
    align: 'center',
    minWidth: 100
  },
  {
    id: 'leader',
    label: 'Leader',
    minWidth: 200
  },
  {
    id: 'class',
    label: 'Class',
    minWidth: 100
  }
]

export default function TabGroup({ renderType, handleError }: GroupRenderProps) {
  const addToast = useToasts()

  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const router = useRouter()
  const [totalItems, setTotalItems] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [openAlertDeleteGroup, setOpenAlertDeleteGroup] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [listGroup, setlistGroup] = useState<any[]>([])
  const [searchName, setSearchName] = useState<string>('')
  const [storeSearchName, setStoreSearchName] = useState<string>('')
  const [updateUI, setUpdateUI] = useState<boolean>(true)
  const [reason, setReason] = useState<string>('')
  const [userInforId, setUserInforId] = useState<string>('')

  useEffect(() => {
    getUserInfor()
    getListGroup()
  }, [storeSearchName, page, rowsPerPage, updateUI])

  const getUserInfor = async () => {
    const userData = await userDBDexie.getUser()
    setUserInforId(userData?.id ?? '')
  }

  const getListGroup = async () => {
    try {
      const payload: QueryGroupListModel = {
        name: storeSearchName,
        majorIdsString: '',
        orderBy: '',
        page: page + 1,
        pageSize: rowsPerPage,
        type: renderType === 'all' ? '' : renderType,
        value: ''
      }

      await groupAPI
        .getList(payload)
        .then(res => {
          const data = new CommonResponse(res)
          setTotalItems(data.pagination?.total ?? 0)
          const groups: Group[] = data.data
          const list = groups.map(group => ({
            id: group.id,
            name: group.name,
            avatarGroup: group.avatar,
            class: group.className,
            subject: group.subjectName,
            member: `${group.memberCount}/${group.groupSize}`,
            leader: group.members?.at(0)?.user?.fullName,
            leaderId: group.members?.at(0)?.user?.id,
            createdById: group.createdBy?.userId,
            avatarLeader: group.members?.at(0)?.user?.avatar
          }))
          setlistGroup(list)
        })
        .catch(err => {
          console.log(err)
          handleError && handleError(err)
        })
    } catch (err) {
      console.log(err)
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

  const handleClickOpenAlertDeleteGroup = () => {
    setOpenAlertDeleteGroup(true)
  }

  const handleCloseAlertDeleteGroup = () => {
    setOpenAlertDeleteGroup(false)
  }

  const handleClickOpenAlert = () => {
    setOpenAlert(true)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const handleMoveOutGroup = () => {
    if (reason !== '') {
      moveOutGroup()
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseUpdateUI = () => {
    setOpen(false)
    setUpdateUI(!updateUI)
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
    handleClickOpenAlert()

    // handleOptionsClose()
  }

  const handleDeleteGroup = async () => {
    try {
      await groupAPI
        .delete(selectedRow?.id)
        .then(res => {
          const data = new CommonResponse(res)
          setUpdateUI(!updateUI)
          addToast.addToast(data.message, { appearance: 'success' })
          setOpenAlertDeleteGroup(false)
          handleOptionsClose()
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const moveOutGroup = async () => {
    try {
      const request: any = {
        groupId: selectedRow?.id,
        description: reason
      }
      await memberAPI
        .moveOut(request)
        .then(res => {
          const data = new CommonResponse(res)
          setUpdateUI(!updateUI)
          addToast.addToast(data.message, { appearance: 'success' })
          setOpenAlert(false)
          handleOptionsClose()
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleViewDetail = async (row?: any) => {
    // Handle view detail action
    row?.id && setSelectedRow(row)
    await saveGroupInfor(row?.id ? row : selectedRow)
    router.push('/group/task')

    // handleOptionsClose()
  }

  const saveGroupInfor = async (groupInfo: any) => {
    try {
      const value: Group = await new Promise((resolve, reject) => {
        groupAPI
          .getById(groupInfo.id)
          .then(res => {
            const data = new CommonResponse(res)
            const group: Group = data.data
            resolve(group)
          })
          .catch(err => {
            reject(err)
          })
      })

      await groupDBDexie.saveGroup({
        id: value.id,
        name: value.name,
        avatarGroup: value.avatar,
        createdBy: value.createdBy?.id,
        groupSize: value.groupSize,
        memberCount: value.memberCount,
        schoolName: value.schoolName,
        className: value.className,
        subject: value.subjectName,
        theme: value.theme
      })

      await groupAPI
        .getRoleInGroup(groupInfo?.id ?? '')
        .then(role => {
          const r = new CommonResponse(role).data

          groupDBDexie.saveRole(r)
        })
        .catch(error => {
          console.log(error)

          //  handleError(error)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChangeReason = (event: ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
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
          onChange={handleSearch}
          onKeyDown={handleEnterSearch}
          placeholder='Search by group, class,...'
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
          Create Group
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <DialogTitle>Create Group</DialogTitle>
            <DialogActions>
              <Button onClick={handleClose}>
                <Close sx={{ color: 'red' }} />
              </Button>
            </DialogActions>
          </Box>
          <DialogContent>
            <GroupForm type='CREATE' onButtonClickClose={handleCloseUpdateUI} />
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
            {listGroup.map((row, index) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.id} onClick={() => handleViewDetail(row)}>
                  <TableCell align='center' sx={{ minWidth: '20px' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {/* {column.format && typeof value === 'number' ? column.format(value) : value} */}
                        {column.id === 'name' || column.id === 'leader' ? (
                          <AvatarName
                            avatar={column.id === 'name' ? row.avatarGroup : row.avatarLeader}
                            title={value}
                          />
                        ) : (
                          value
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

          {userInforId !== selectedRow?.createdById &&
          userInforId !== selectedRow?.leaderId &&
          userInforId !== selectedRow?.createdById ? (
            <MenuItem onClick={handleDelete}>
              <ExitToApp fontSize='small' sx={{ mr: 3 }} /> Out Group
            </MenuItem>
          ) : null}

          {userInforId === selectedRow?.createdById ? (
            <MenuItem onClick={handleClickOpenAlertDeleteGroup}>
              <Delete fontSize='small' sx={{ mr: 3 }} /> Delete Group
            </MenuItem>
          ) : null}
        </Menu>
      </TableContainer>

      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{selectedRow?.name}</DialogTitle>
        <DialogContent>
          <TextField
            id='reason'
            label='Reason'
            multiline
            value={reason}
            onChange={handleChangeReason}
            rows={4}
            placeholder='Reason'
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
          <DialogContentText id='alert-dialog-description'>Do you want to move out this group?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Cancel</Button>
          <Button onClick={handleMoveOutGroup} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAlertDeleteGroup}
        onClose={handleCloseAlertDeleteGroup}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{selectedRow?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Do you want to delete this group?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertDeleteGroup}>Cancel</Button>
          <Button onClick={handleDeleteGroup} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

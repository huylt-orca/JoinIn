import { useEffect, useState } from 'react'
import { Member, Task } from 'src/models/class'
import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  TextField,
  Typography,
  Button,
  Grid,
  Tooltip
} from '@mui/material'
import { memberAPI, taskAPI } from 'src/api-client'
import { useRouter } from 'next/router'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { AxiosError } from 'axios'
import { useToasts } from 'react-toast-notifications'
import { Cancel, ContentSave } from 'mdi-material-ui'

export interface IAssignViewProps {
  data: Task
}

export default function AssignView(props: IAssignViewProps) {
  const [listMember, setListMember] = useState<Member[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const addToast = useToasts()
  const [selectedMember, setSelectedMember] = useState<Member[]>([])
  const [oldValue, setOldValue] = useState<Member[]>([])
  const [isEdit, setIsEdit] = useState(false)

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    if (props.data.group?.id) {
      fetchUsers()
    }
  }, [props])

  const fetchUsers = async () => {
    setLoading(true)
    await memberAPI
      .getAllMember(props.data.group?.id ?? '')
      .then(res => {
        const list: Member[] = new CommonResponse(res).data

        const listAssign: Member[] = []
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          props.data.assignedFor?.map(item => {
            if (item.id === element.user?.id) {
              listAssign.push(element)
            }
          })
        }

        setOldValue(listAssign)
        setSelectedMember(listAssign)
        setListMember(list)
        setLoading(false)
      })
      .catch(error => {
        if ((error as AxiosError)?.response?.status === 401) {
          notify('Login expired.', 'error')
          router.push('/user/logout', '/user/login')
        } else {
          console.log(error)
        }
      })
  }

  const handleAssignTask = async () => {
    setLoading(true)
    setIsEdit(false)
    await taskAPI
      .assignTask({
        taskId: props.data.id,
        assignedForIds: selectedMember.map(item => item.id)
      })
      .then(res => {
        setTimeout(() => {
          const commonResposne = new CommonResponse(res)
          if (commonResposne?.status === 500) {
            notify(commonResposne.message ?? 'Something error', 'error')
          } else {
            commonResposne.message && notify(commonResposne.message, 'success')
          }
          setLoading(false)
        }, 300)
      })
      .catch(error => {
        setTimeout(() => {
          setLoading(false)
          setSelectedMember(oldValue)
        }, 1000)

        if ((error as AxiosError)?.response?.status === 401) {
          notify('Login expired.', 'error')
          router.push('/user/logout', '/user/login')
        } else if ((error as AxiosError)?.response?.status === 500) {
          const commonResposne = new CommonResponse((error as AxiosError)?.response?.data as CommonResponse)
          notify(commonResposne.message ?? 'Something error', 'error')
        } else {
          console.log(error)

          notify('Something error', 'error')
        }
      })
  }

  return (
    <div>
      <Autocomplete
        multiple
        disabled={loading}
        value={selectedMember}
        onChange={async (event, newValue) => {
          setIsEdit(true)
          setSelectedMember(newValue)
        }}
        options={listMember.filter(item => selectedMember.indexOf(item) === -1)}
        getOptionLabel={option => (option?.user?.fullName ? option?.user.fullName : 'Không tên')}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <div key={index}>
              <Chip
                avatar={<Avatar alt='Natacha' src={option?.user?.avatar} sizes='medium' />}
                label={option?.user?.fullName}
                {...getTagProps({ index })}
                variant='outlined'
                sx={{
                  m: 1
                }}
                disabled={false}
              />
            </div>
          ))
        }
        renderOption={(props, option) => (
          <Box component='li' {...props}>
            <Avatar alt={option?.user?.fullName} src={option?.user?.avatar} sizes='small' />
            <Typography ml={2}>{option?.user?.fullName}</Typography>
          </Box>
        )}
        style={{ width: 'auto' }}
        renderInput={params => (
          <>
            <Grid container justifyContent={'center'} flexDirection={'column'} spacing={1}>
              <TextField {...params} placeholder='Assignee' size='medium' disabled={loading} />

              {isEdit && (
                <>
                  <Grid container justifyContent={'center'} spacing={2} mt={2}>
                    <Tooltip title='Save'>
                      <Button onClick={handleAssignTask}>
                        <ContentSave />
                      </Button>
                    </Tooltip>
                    <Tooltip title='Cancel'>
                      <Button
                        onClick={() => {
                          setSelectedMember(oldValue)
                          setIsEdit(false)
                        }}
                      >
                        <Cancel />
                      </Button>
                    </Tooltip>
                  </Grid>
                </>
              )}
            </Grid>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px'
                }}
                color='info'
              />
            )}
          </>
        )}
        sx={{ position: 'relative' }}
      />
    </div>
  )
}

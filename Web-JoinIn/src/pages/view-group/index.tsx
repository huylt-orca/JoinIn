import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Close } from 'mdi-material-ui'
import ApplicationForm from 'src/views/group/application/ApplicationForm'
import { useEffect, useState } from 'react'
import { Group, GroupMajor } from 'src/models/class'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { groupAPI } from 'src/api-client'
import GroupDetail from 'src/views/group/group-detail/GroupDetial'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import withAuth from '../withAuth'

interface State {
  groupName?: string
  schoolName?: string
  className?: string
  subject?: string
  leader?: string
}

const GroupView = () => {
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [imgBackgroud, setImgBackground] = useState<string>('/images/cards/background-user.png')
  const [values, setValues] = useState<State>({
    groupName: '',
    schoolName: '',
    className: '',
    subject: '',
    leader: ''
  })
  const [skills, setSkills] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [listRecruiting, setListRecruiting] = useState<GroupMajor[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const addToast = useToasts()
  const router = useRouter()
  const query = router.query

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    getInformation()
    getListRecruiting()
  }, [query])

  const getListRecruiting = async () => {
    try {
      if (!query.group) {
        router.push('/finding-groups')

        return
      }

      await groupAPI
        .getListRecruiting(query.group as string)
        .then(res => {
          const data = new CommonResponse(res)
          const list: GroupMajor[] = data.data
          setListRecruiting(list)
        })
        .catch(err => {
          handleError(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const getInformation = async () => {
    try {
      if (!query.group) {
        router.push('/finding-groups')

        return
      }

      await groupAPI
        .getById(query.group as string)
        .then(res => {
          const data = new CommonResponse(res)

          const group: Group = data.data

          setValues({
            groupName: group.name,
            schoolName: group.schoolName,
            className: group.className,
            subject: group.subjectName,
            leader: group.members?.at(0)?.user?.fullName
          })
          setSkills(group.skill ?? '')
          setDescription(group.description ?? '')
          setImgBackground(group.theme ?? '/images/cards/background-user.png')
          setImgSrc(group.avatar ?? '/images/avatars/1.png')
        })
        .catch(err => {
          handleError(err)
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
    <>
      <GroupDetail
        values={values}
        description={description}
        imgBackground={imgBackgroud}
        imgSrc={imgSrc}
        skills={skills}
        listRecruiting={listRecruiting}
        actionGroup={
          <Button
            variant='contained'
            sx={{ marginRight: 5 }}
            onClick={() => {
              setOpen(true)
            }}
          >
            Apply
          </Button>
        }
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle>Application</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>
              <Close sx={{ color: 'red' }} />
            </Button>
          </DialogActions>
        </Box>
        <DialogContent>
          <ApplicationForm onButtonClick={() => setOpen(false)}  />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default withAuth(GroupView)

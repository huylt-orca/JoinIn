// ** MUI Imports
import Button from '@mui/material/Button'
import { ReactNode, useEffect, useState } from 'react'
import withAuth from '../../withAuth'
import { Group, GroupMajor } from 'src/models/class'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { groupDBDexie } from 'src/models/db/GroupDB'
import { groupAPI } from 'src/api-client'
import GroupDetail from 'src/views/group/group-detail/GroupDetial'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import UserGroupLayout from 'src/layouts/UserGroupLayout'

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
  const [isLeader, setIsLeader] = useState<boolean>(false)
  const addToast = useToasts()
  const router = useRouter()

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    getInformation()
    getListRecruiting()
    checkRole()
  }, [])

  const getListRecruiting = async () => {
    try {
      await groupDBDexie.getGroup().then(async groupData => {
        await groupAPI
          .getListRecruiting(groupData?.id ?? '')
          .then(res => {
            const data = new CommonResponse(res)
            const list: GroupMajor[] = data.data
            setListRecruiting(list)
          })
          .catch(err => {
            handleError(err)
          })
      })
    } catch (err) {
      console.log(err)
    }
  }

  const getInformation = async () => {
    try {
      const groupData = await groupDBDexie.getGroup()
      await groupAPI
        .getById(groupData?.id)
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

  const checkRole = async () => {
    await groupDBDexie.getGroup().then(async groupData => {
      groupData &&
        (await groupAPI
          .getRoleInGroup(groupData.id ?? '')
          .then(role => {
            const r = new CommonResponse(role).data

            if (r === 'LEADER' || r === 'SUB_LEADER') {
              setIsLeader(true)
            } else {
              setIsLeader(false)
            }
          })
          .catch(error => {
            handleError(error)
          }))
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

  return (
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
          disabled={!isLeader}
          onClick={() => {
            if (isLeader) {
              router.push('/group/group-setting')
            }
          }}
        >
          Update
        </Button>
      }
    />
  )
}

GroupView.getLayout = (page: ReactNode) => <UserGroupLayout>{page}</UserGroupLayout>

export default withAuth(GroupView)

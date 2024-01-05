// ** MUI Imports
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  CardContent,
  Divider,
  Box,
  Typography,
  SelectChangeEvent
} from '@mui/material'
import { InformationVariant } from 'mdi-material-ui'
import { FC, SetStateAction, useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { applicationAPI, groupAPI } from 'src/api-client'
import { GroupMajor } from 'src/models/class'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { ApplicationRequest } from 'src/models/query-models/ApplicationRequest'
import Editor from 'src/views/dialog/editor'
import { useRouter } from 'next/router'

// ** Icons Imports

interface ChildComponentProps {
  onButtonClick: () => void;
}

const ApplicationForm: FC<ChildComponentProps> = ({ onButtonClick }) => {
  // ** State
  const [description, setDescription] = useState<string>('')
  const [selectedValue, setSelectedValue] = useState('')
  const [listRecruiting, setListRecruiting] = useState<GroupMajor[]>([])
  const router = useRouter()

  const addToast = useToasts()

  useEffect(() => {
    getListRecruiting()
  }, [])

  const getListRecruiting = async () => {
    try {
      // await groupDBDexie.getGroup().then(async groupData => {
      //   if (groupData?.id) {
      //     await groupAPI.getListRecruiting(groupData?.id).then(res => {
      //       const data = new CommonResponse(res)
      //       const list: GroupMajor[] = data.data
      //       setListRecruiting(list)
      //     })
      //   } else {
      //     const query = router.query.group as string
      //     if (query) {
      //       await groupAPI.getListRecruiting(query).then(res => {
      //         const data = new CommonResponse(res)
      //         const list: GroupMajor[] = data.data
      //         setListRecruiting(list)
      //       })
      //     }
      //   }
      // })

      const query = router.query.group as string
          if (query) {
            await groupAPI.getListRecruiting(query).then(res => {
              const data = new CommonResponse(res)
              const list: GroupMajor[] = data.data
              setListRecruiting(list)
            })
          }
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value)
  }

  const handleClickSend = async () => {
    if (selectedValue !== '') {
      await sendApplication()
      onButtonClick()
    }
  }

  const sendApplication = async () => {
    try {
      // let groupId = ''
      // const groupData = await groupDBDexie.getGroup()
      // const query = router.query.group as string
      // if (query) {
      //   groupId = query
      // } else {
      //   groupId = groupData?.id ?? ''
      // }
      const groupId = router.query.group as string
      const application: ApplicationRequest = {
        Description: description,
        GroupId: groupId,
        MajorIds: [selectedValue]
      }

      await applicationAPI
        .postApplication(application)
        .then(async res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
        })
        .catch(error => {
          console.log('Application Form: ', error)
        })
    } catch (e) {
      console.log('Application Form: ', e)
    }
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Major</InputLabel>
              <Select label='Role' value={selectedValue} onChange={handleChange}>
                {listRecruiting.map(item => (
                  <MenuItem key={item.major?.id} value={item.major?.id}>
                    {item.major?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <InformationVariant fontSize='small' sx={{ marginRight: 1 }} />
              <Typography variant='body2'>Description</Typography>
            </Box>
            <Editor
              name='description'
              value={description}
              onChange={(dataChange: SetStateAction<string>) => {
                setDescription(dataChange.toString())
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleClickSend}>
              Send
            </Button>
          </Grid>
        </Grid>
      </form>
      <Divider sx={{ m: '20px' }}>Recruiting</Divider>
      {listRecruiting.map((item: GroupMajor, index: number) => {
        return (
          <Box
            key={item.majorId}
            sx={{ display: 'flex', alignItems: 'center', mb: index !== listRecruiting.length - 1 ? 6 : 0 }}
          >
            <Box
              sx={{
                ml: 4,
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>{item.major?.name}</Typography>
              </Box>
              <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'success.main', mr: 5 }}>
                  {item.memberCount}
                </Typography>
              </Box>
            </Box>
          </Box>
        )
      })}
    </CardContent>
  )
}

export default ApplicationForm

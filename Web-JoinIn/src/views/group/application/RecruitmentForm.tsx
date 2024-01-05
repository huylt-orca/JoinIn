// ** MUI Imports
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CardContent,
  Divider,
  Box,
  Typography,
  IconButton,
  SelectChangeEvent
} from '@mui/material'
import { AccountMultiple, DeleteOutline } from 'mdi-material-ui'
import { ChangeEvent, useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { groupAPI, majorAPI } from 'src/api-client'
import { GroupMajor, Major } from 'src/models/class'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { groupDBDexie } from 'src/models/db/GroupDB'

const RecruitmentForm = () => {
  // ** State
  const [selectedValue, setSelectedValue] = useState('')
  const [listMajors, setListMajors] = useState<Major[]>([])
  const [quantity, setQuantity] = useState<number>(0)
  const [listRecruiting, setListRecruiting] = useState<any[]>([])
  const addToast = useToasts()
  const [updateUI, setUpdateUI] = useState<boolean>(true)

  useEffect(() => {
    getListMajors()
    getListRecruiting()
  }, [updateUI])

  const getListRecruiting = async () => {
    try {
      await groupDBDexie.getGroup().then(async groupData => {
        await groupAPI.getListRecruiting(groupData?.id ?? '').then(res => {
          const data = new CommonResponse(res)
          const list: any[] = data.data.map((value: GroupMajor) => ({
            majorId: value.major?.id,
            memberCount: value.memberCount,
            name: value.major?.name
          }))
          setListRecruiting(list)
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value)
    const recru = listRecruiting.find(recr => recr.majorId === event.target.value)
    setQuantity(recru?.memberCount ?? 0)
  }

  const handleChangeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value))
  }

  const getListMajors = async () => {
    try {
      await majorAPI
        .getList()
        .then(res => {
          const data = new CommonResponse(res)
          const majors: Major[] = data.data
          setListMajors(majors)
        })
        .catch(error => {
          console.log(error)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddMajor = () => {
    if (selectedValue !== '' && quantity !== 0){
      const updateList = [...listRecruiting]
      const majorIndex = updateList.findIndex(recr => recr.majorId === selectedValue)
      if (majorIndex !== -1) {
        updateList[majorIndex].memberCount = quantity
      } else {
        const dataMajor = listMajors.find(major => major.id === selectedValue)
        updateList.push({ majorId: selectedValue, memberCount: quantity, name: dataMajor?.name })
      }
      saveRecruitingList(updateList)
    }
  }

  const handleClickDelete = (indexInput: number) => {
    // handle delete recruitment
    const updateRecruiting = listRecruiting.filter((data, index) => index !== indexInput)
    saveRecruitingList(updateRecruiting)
    setListRecruiting(updateRecruiting)
  }

  const saveRecruitingList = async (listRecruiting: any[]) => {
    try {
      // const listMajor :any[] = listRecruiting.map(data => ({
      //   majorId: data.majorId,
      //   memberCount: data.memberCount
      // }))
      const groupData = await groupDBDexie.getGroup()
      const request: any = {
        groupId: groupData?.id,
        groupMajorsDTO: listRecruiting
      }
      await groupAPI.putRecruiting(request).then(res => {
        const data = new CommonResponse(res)
        addToast.addToast(data.message)
        setUpdateUI(!updateUI)
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Major</InputLabel>
              <Select label='Major' value={selectedValue} onChange={handleChange}>
                {listMajors.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label='Quantity'
              value={quantity}
              onChange={handleChangeQuantity}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AccountMultiple />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleAddMajor}>
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
      <Divider sx={{ m: '20px' }}>Recruiting</Divider>
      {listRecruiting.map((item: any, index: number) => {
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
                <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>{item.name}</Typography>
              </Box>
              <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'success.main', mr: 5 }}>
                  {item.memberCount}
                </Typography>
                <IconButton onClick={() => handleClickDelete(index)}>
                  <DeleteOutline color='error' />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )
      })}
    </CardContent>
  )
}

export default RecruitmentForm

// ** React Imports
import { useState, KeyboardEvent, ChangeEvent, useEffect, FC } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// ** Icons Imports
import { Autocomplete, Avatar, Typography } from '@mui/material'
import { groupDBDexie } from 'src/models/db/GroupDB'
import { ApplicationRequest } from 'src/models/query-models/ApplicationRequest'
import { applicationAPI, userAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { useToasts } from 'react-toast-notifications'
import { User } from 'src/models/class'

interface Option {
  id: string
  label: string
  image: string
  email:string
  name: string
  major: string
}

interface ChildComponentProps {
  onButtonClick: () => void;
}

const InviteForm : FC<ChildComponentProps> = ({ onButtonClick }) => {
  // ** State
  const [selectedValues, setSelectedValues] = useState<Option[]>([])
  const addToast = useToasts()
  const [listUser, setListUser] = useState<Option[]>([])
  const [searchName, setSearchName] = useState<string>('');
  const [storeSearchName,setStoreSearchName] = useState<string>('');


  useEffect(()=>{
    storeSearchName!=='' && getListUser()
  },[storeSearchName])

  const handleInvite = () =>{
    if (selectedValues.length !== 0){
      inviteMember()
      onButtonClick()
    }
  }

  const inviteMember = async () => {
    try {
      const groupData = await groupDBDexie.getGroup()
      const listUser = selectedValues.map(item => item.id);

      const application: ApplicationRequest = {
        Description: '',
        GroupId: groupData?.id,
        UserIds: listUser
      }

      await applicationAPI
        .postInvitation(application)
        .then(async res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
        })
        .catch(error => {
          console.log('Invite Form: ', error)
        })

    } catch(err){
      console.log(err);
    }
  }

  const getListUser = async () =>{
    try {

      await userAPI
        .getList(storeSearchName)
        .then(res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })

          const users: User[] = data.data.map((user: User) => new User(user))

          const list = users.map(user => ({
            id: user.id,
            label: user.email,
            image: user.avatar,
            email: user.email,
            name: user.fullName,
            major: 'Information Technology'
          } as Option) )
          setListUser(list)
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleEnterSearch = (event: KeyboardEvent<HTMLInputElement>) => {

    if (event.key === 'Enter') { console.log(event.currentTarget.value)
      setStoreSearchName(searchName);
    }
  };

  const handleSearch = (event:ChangeEvent<HTMLInputElement>) =>{
    setSearchName(event.target.value)
  }

  return (
    <CardContent sx={{ width: '500px' }}>
      <Autocomplete
        multiple
        options={listUser}
        getOptionLabel={option => option.label}
        onChange={(event, value) => setSelectedValues(value)}
        renderInput={params => <TextField {...params} label='Email' variant='outlined' onKeyDown={handleEnterSearch} onChange={handleSearch} />}
        renderOption={(props, option) => (
          <li {...props}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={option.image} alt={option.name} style={{ marginRight: 10, width: 30, height: 30 }} />
              <div>
              <Typography fontSize={17} fontWeight={600} >{option.name}</Typography>
                <Typography variant='body2'>{option.email}</Typography>
                <Typography variant='body2'>{option.major}</Typography>
              </div>
            </div>
          </li>
        )}
      />
      <Button variant='contained' sx={{ mt: 5 }} onClick={handleInvite}>
        Send
      </Button>
    </CardContent>
  )
}

export default InviteForm

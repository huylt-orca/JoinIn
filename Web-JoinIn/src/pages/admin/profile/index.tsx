// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Icons Imports
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

// ** Demo Tabs Imports
import TabAccount from 'src/views/profile/TabAccount'
import TabSecurity from 'src/views/profile/TabSecurity'

// ** Third Party Styles Imports
import ProfileView from 'src/views/profile/ProfileView'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import withAuth from 'src/pages/withAuth'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const Profile = () => {
  // ** State
  const [value, setValue] = useState<string>('view')
  const [editable, setEditable] = useState<boolean>(false)
  const addToast = useToasts()
  const router = useRouter()

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
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
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='view'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LockOpenOutline />
                <TabName>Account</TabName>
              </Box>
            }
          />
          <Tab
            value='security'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LockOpenOutline />
                <TabName>Security</TabName>
              </Box>
            }
          />
        </TabList>
        <TabPanel sx={{ p: 0 }} value='view'>
          {!editable ? (
            <ProfileView
              handleError={handleError}
              actionProfile={
                <>
                  <Button variant='contained' color='success' sx={{ marginRight: 5 }} onClick={() => setEditable(true)}>
                    Edit
                  </Button>
                </>
              }
            />
          ) : (
            <TabAccount
              actionProfile={
                <>
                  <Button variant='contained' color='error' sx={{ marginRight: 5 }} onClick={() => setEditable(false)}>
                    Cancel
                  </Button>
                </>
              }
              exitEdit={setEditable}
            />
          )}
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='security'>
          <TabSecurity />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default withAuth(Profile)

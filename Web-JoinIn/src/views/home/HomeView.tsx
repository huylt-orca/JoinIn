// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { FormatListGroup, Handshake, KeyVariant } from 'mdi-material-ui'
import TabGroup from 'src/views/my-groups/TabGroup'
import { GroupRenderType } from 'src/constants'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import { AxiosError } from 'axios'

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

const HomeView = () => {
  // ** State
  const [value, setValue] = useState<string>('All')
  const addToast = useToasts()
  const router = useRouter()

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
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

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
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
            value='All'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormatListGroup />
                <TabName>All</TabName>
              </Box>
            }
          />
          <Tab
            value='Owner Group'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <KeyVariant />
                <TabName>Owner Group</TabName>
              </Box>
            }
          />
          <Tab
            value='Joined Group'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Handshake />
                <TabName>Joined Group</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='All'>
          <TabGroup renderType={GroupRenderType.All} handleError={handleError} />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='Owner Group'>
          <TabGroup renderType={GroupRenderType.Owner} handleError={handleError} />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='Joined Group'>
          <TabGroup renderType={GroupRenderType.Member} handleError={handleError} />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default HomeView

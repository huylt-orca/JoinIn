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
import { FlagVariant, Information } from 'mdi-material-ui'
import GroupForm from 'src/views/my-groups/GroupForm'
import Milestone from 'src/views/group/group-setting/Milestones'
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

const GroupSetting = () => {
  // ** State
  const [value, setValue] = useState<string>('information')

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
            value='information'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Information/>
                <TabName>Information</TabName>
              </Box>
            }
          />
          <Tab
            value='milestone'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FlagVariant />
                <TabName>Milestone</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='information'>
          <GroupForm type='UPDATE'/>
        </TabPanel>
        <TabPanel sx={{ p: 0}} value='milestone'>
          <Milestone/>
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default withAuth(GroupSetting)

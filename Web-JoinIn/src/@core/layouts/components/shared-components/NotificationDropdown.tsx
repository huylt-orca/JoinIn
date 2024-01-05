// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Badge from '@mui/material/Badge'

// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { userDBDexie } from 'src/models/db/UserDB'
import { notificationAPI } from 'src/api-client/notification'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { Notification } from 'src/models/class'
import { notificationStatus } from 'src/constants/notification-status'
import moment from 'moment'
import { QueryKeys, StorageKeys } from 'src/constants'
import { useRouter } from 'next/router'
import { CircularProgress } from '@mui/material'
import { AxiosError } from 'axios'
import { useToasts } from 'react-toast-notifications'
import { NotificationDataResponse } from 'src/models/class/NotificationDataResponse'

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

// ** Styled Avatar component
const Avatar = styled(MuiAvatar)<AvatarProps>({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const NotificationDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  const [notifications, setNotificaitons] = useState<Notification[]>([])
  const [newNotification, setNewNotificaiton] = useState<Notification>()
  const [messgaeUnseenCount, setMessgaeUnseenCount] = useState<number>(0)
  const [numOfNotification, setNumOfNotification] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const addToast = useToasts()

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${QueryKeys.BASE_LOCAL}/notificationHub`)
      .withAutomaticReconnect()
      .build()
    userDBDexie.getUser().then(async userDB => {
      await getNotification(numOfNotification)
      await connection
        .start()
        .then(() => {
          console.log('SignalR Connected', userDB?.id)
        })
        .catch(error => console.log('SignalR Connection Error: ', error))

      connection.on(userDB?.id || 'Notification', message => {
        setNewNotificaiton(new Notification(JSON.parse(message)))
      })
    })

    return () => {
      connection.stop()
    }
  }, [])

  useEffect(() => {
    newNotification && handleGetNewNotification(newNotification)
  }, [newNotification])

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = async (notification: Notification) => {
    notification.link && router.push(notification.link)
    handleDropdownClose()

    if (notification.status === 0 && notification.id.length !== 0) {
      await notificationAPI.readNotification([notification.id]).then(async () => {
        setMessgaeUnseenCount(messgaeUnseenCount - 1)
        await getNotification(numOfNotification)
      })
    }
  }

  const getNotification = async (num: number) => {
    const notificationList = await notificationAPI.getNotification(num).catch(error => {
      console.log(error)

      if ((error as AxiosError)?.response?.status === 400) {
        const commonResposne = new CommonResponse((error as AxiosError)?.response?.data as CommonResponse)
        notify(commonResposne.message ?? 'Error', 'error')
      } else {
        console.log(error)
      }
    })

    const commonReponse = new CommonResponse(notificationList)

    const data = new NotificationDataResponse(commonReponse.data)

    setMessgaeUnseenCount(data.hasUnreadNumber)
    setNotificaitons(data.notificationDTOs)
    setIsLoading(false)
  }

  const handleGetNewNotification = (newNoti: Notification) => {
    const list = [newNoti, ...notifications]
    setNotificaitons(list)
    setMessgaeUnseenCount(messgaeUnseenCount + 1)
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge badgeContent={messgaeUnseenCount} color='success'>
          <BellOutline />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notification</Typography>
            <Chip
              size='small'
              label={messgaeUnseenCount}
              color='primary'
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        <PerfectScrollbar
          options={{ suppressScrollX: true }}
          onYReachEnd={() => {
            setTimeout(() => {
              if (isLoading) return
              setIsLoading(true)

              const num = numOfNotification + 5
              if (numOfNotification > notifications.length) {
                setIsLoading(false)

                return
              }

              setNumOfNotification(num)
              getNotification(num)
            }, 10)
          }}
        >
          {notifications?.map((item, index) => {
            let messageTime = ''

            const a = moment(moment().format(StorageKeys.KEY_FORMAT_DATE))
            const b = moment(moment(item.createdDate).format(StorageKeys.KEY_FORMAT_DATE))
            const diff = a.diff(b, 'days')

            if (diff === 0) {
              messageTime = 'Today'
            } else if (diff === 1) {
              messageTime = `a day ago`
            } else if (diff > 1 && diff < 7) {
              messageTime = `${diff} days ago`
            } else {
              messageTime = b.format(StorageKeys.KEY_FORMAT_DATE)
            }

            return (
              <MenuItem key={index} onClick={() => handleNotificationClick(item)}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <Avatar alt='Notification' src={item.image} />
                  <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                    <MenuItemTitle color={item.status === 0 ? 'black' : '#b7b7b7'}>
                      {notificationStatus.at(item.type)?.lable}
                    </MenuItemTitle>
                    <MenuItemSubtitle variant='body2'>{item.message}</MenuItemSubtitle>
                  </Box>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {messageTime}
                  </Typography>
                </Box>
              </MenuItem>
            )
          })}
          {isLoading && (
            <MenuItem
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <CircularProgress />
            </MenuItem>
          )}
        </PerfectScrollbar>
        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown

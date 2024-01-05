import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiDivider, { DividerProps } from '@mui/material/Divider'
import { Avatar } from '@mui/material'
import withAuth from '../withAuth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'

// Styled Divider component
const Divider = styled(MuiDivider)<DividerProps>(({ theme }) => ({
  margin: theme.spacing(5, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const SpaceBetweenText = (props: { title: string; content: string }) => {
  return (
    <Box
      sx={{
        ml: 20,
        mt: 7,
        width: '70%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{props.title}:</Typography>
      </Box>
      <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
        {props.content}
      </Typography>
    </Box>
  )
}

const Payment = () => {
  const router = useRouter()
  const addToast = useToasts()
  const [dataCode, setDataCode] = useState<string>('')

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    const code = router.query.code as string

    if (!code) {
      notify('You are not able to access this page', 'error')
      router.push('/user/logout', '/user/login')

      return
    }

    setDataCode(code)
  }, [])

  return (
    <Card>
      <CardHeader title='Payment' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
        <Box sx={{ width: '100%' }}>
          <CardHeader
            title='Quick payment by QR code'
            sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          />
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar src='/images/paymentmomo.jpg' alt='image' variant='rounded' sx={{ width: 300, height: 300 }} />
          </CardContent>
        </Box>

        <Divider flexItem />

        <Box sx={{ width: '100%' }}>
          <CardHeader
            title='Momo Account'
            sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          />
          <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
            <SpaceBetweenText title='Transaction Code' content={dataCode} />
            <SpaceBetweenText title='Money' content='50.000VND' />
            <SpaceBetweenText title='Bank Account Number' content='0937627033' />
            <SpaceBetweenText title='Owner Bank' content='PHAM XUAN KIEN' />
            <SpaceBetweenText title='Content' content={`${dataCode}`} />
          </CardContent>
        </Box>
      </Box>
      <Typography variant='body1' color='error' align='center' m={5}>
        *Your account will be updated daily at 11pm after payment
      </Typography>
    </Card>
  )
}
export default withAuth(Payment)

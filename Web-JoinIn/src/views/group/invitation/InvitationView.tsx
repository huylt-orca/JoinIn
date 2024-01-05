import { Card, CardContent, Typography, Divider, Box, Button } from '@mui/material'
import { applicationAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { GroupData } from 'src/pages/view-group/invitation'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import { useToasts } from 'react-toast-notifications'

interface InvitationViewProps {
  values: GroupData
  applicationId?: string
}

const InvitationView = ({ values, applicationId }: InvitationViewProps) => {
  const router = useRouter()
  const addToast = useToasts()

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  const handleAcceptInvite = () => {
    applicationId &&
      applicationAPI
        .userConfirmInvite(applicationId, 4)
        .then(res => {
          const commonResponse = new CommonResponse(res)
          notify(commonResponse.message, 'success')
        })
        .catch(error => handleError(error))
  }

  const handleRejectInvite = () => {
    applicationId &&
      applicationAPI
        .userConfirmInvite(applicationId, 5)
        .then(res => {
          const commonResponse = new CommonResponse(res)
          notify(commonResponse.message, 'success')
        })
        .catch(error => handleError(error))
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
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 3.5 }}>
          Invitation
        </Typography>
        <Divider sx={{ marginY: '20px' }} />
        <Typography align='center' variant='h6'>
          {' '}
          Group {values.groupName} has sent you an invitation to join the group.
          <br /> Would you like to join with them?{' '}
        </Typography>
        <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'center' }}>
          <Button variant='outlined' size='small' color='error' sx={{ marginRight: 5 }} onClick={handleRejectInvite}>
            Reject
          </Button>
          <Button variant='contained' size='small' color='success' onClick={handleAcceptInvite}>
            Accept
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default InvitationView

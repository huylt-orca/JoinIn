import * as React from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import { Check } from 'mdi-material-ui'
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Milestone } from 'src/models/class'
import { milestoneAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1
  }
}))

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4'
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor'
  }
}))

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? <Check className='QontoStepIcon-completedIcon' /> : <div className='QontoStepIcon-circle' />}
    </QontoStepIconRoot>
  )
}

export default function CustomizedSteppers() {
  const [listMilestones, setListMilestones] = useState<Milestone[]>([])
  const [currentMilestone, setCurrentMilestone] = useState<Milestone>()
  const addToast = useToasts()
  const router = useRouter()

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    getListMilestone()
  }, [])

  const getListMilestone = async () => {
    try {
      await milestoneAPI
        .getList()
        .then(res => {
          const data = new CommonResponse(res)
          const milestones: Milestone[] = data.data.milestones

          setListMilestones(milestones)
          setCurrentMilestone(milestones[data.data.currentMilestoneOrder - 1])
        })
        .catch(error => {
          handleError(error)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleError = (error: any) => {
    const dataErr = (error as AxiosError)?.response
    if (dataErr?.status === 401) {
      notify('Login expired.', 'error')
      router.push('/user/logout', '/user/login')
    } else if (dataErr?.status === 500) {
      if (error?.response?.data?.message) notify(error?.response?.data?.message, 'error')
      else notify('Something error', 'error')
    } else {
      console.log(error)
    }
  }

  if (listMilestones.length === 0) return null

  return (
    <Card sx={{ mt: 5 }}>
      <CardHeader title='Milestone' />
      <CardContent>
        <Stack sx={{ width: '100%' }} spacing={4}>
          <Stepper alternativeLabel activeStep={0} connector={<QontoConnector />}>
            {listMilestones.map(listMilestone => (
              <Step key={listMilestone.id}>
                <StepLabel StepIconComponent={QontoStepIcon}>{listMilestone.name}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Divider />
          <Typography variant='h5' align='center'>
            {currentMilestone?.name}
          </Typography>
          <Typography variant='h6' align='center'>
            <div className='editor' dangerouslySetInnerHTML={{ __html: currentMilestone?.description ?? '' }} />
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

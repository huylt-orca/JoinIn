import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Grid, CardContent, Card, CardHeader } from '@mui/material'
import MilestoneForm from './MilestoneForm'
import { useState, useEffect } from 'react'
import { Milestone } from 'src/models/class'
import { milestoneAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { useToasts } from 'react-toast-notifications'
import { groupDBDexie } from 'src/models/db/GroupDB'

export default function MilestoneScreen() {
  const [activeStep, setActiveStep] = useState(0)
  const [currentStep, setcurrentStep] = useState(0)
  const [statusForm, setStatusForm] = useState<string>('Create')
  const [listMilestones, setListMilestones] = useState<any[]>([])

  const [counter, setCounter] = useState(0)

  const handleButtonUpdateUI = () => {
    console.log('kk')
    setCounter(counter + 1)
  }

  const addToast = useToasts()

  useEffect(() => {
    getListMilestone()
  }, [counter])

  const getListMilestone = async () => {
    try {
      await milestoneAPI
        .getList()
        .then(res => {
          const data = new CommonResponse(res)
          const milestones: Milestone[] = data.data.milestones
          const list = milestones.map(milestone => ({
            Id: milestone.id,
            Order: milestone.order,
            Name: milestone.name,
            Description: milestone.description
          }))
          setListMilestones(list)
          const currentOrder = data.data.currentMilestoneOrder - 1
          setActiveStep(currentOrder)
          setcurrentStep(currentOrder)
        })
        .catch(error => {
          console.log(error)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleNext = () => {
    setcurrentStep(activeStep + 1)
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    changeCurrentMilestoneUp()
  }

  const changeCurrentMilestoneUp = async () => {
    try {
      const groupData = await groupDBDexie.getGroup()
      await milestoneAPI
        .putCurrent({ groupId: groupData?.id, wishType: 0 })
        .then(res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const changeCurrentMilestoneDown = async () => {
    try {
      const groupData = await groupDBDexie.getGroup()
      await milestoneAPI
        .putCurrent({ groupId: groupData?.id, wishType: 1 })
        .then(res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChangeStep = (index: number) => {
    if (index === currentStep) {
      setcurrentStep(activeStep)
    } else {
      setcurrentStep(index)
    }
    setStatusForm('Update')
  }

  const handleBack = () => {
    setcurrentStep(activeStep - 1)
    setActiveStep(prevActiveStep => prevActiveStep - 1)
    changeCurrentMilestoneDown()
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const handleClickAddNew = () => {
    setStatusForm('Create')
  }

  return (
    <Grid container spacing={10}>
      <Grid item xs={6} md={6}>
        <Card>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <CardHeader title='Change Milestone' />
            <Button variant='contained' size='small' sx={{ mr: 5 }} onClick={handleClickAddNew}>
              Add New
            </Button>
          </Box>
          <CardContent>
            <Stepper activeStep={activeStep} orientation='vertical'>
              {listMilestones.map((step, index) => (
                <Step key={step.Id} expanded={currentStep == index}>
                  <StepLabel
                    onClick={() => handleChangeStep(index)}
                    optional={
                      index === listMilestones.length ? <Typography variant='caption'>Last step</Typography> : null
                    }
                  >
                    {step.Name}
                  </StepLabel>
                  <StepContent>
                    <Typography>
                      <div className='editor' dangerouslySetInnerHTML={{ __html: step.Description! }} />
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button variant='contained' onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                          {index === listMilestones.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === listMilestones.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={6}>
        <Card>
          <CardHeader title={statusForm === 'Create' ? 'Create' : `Update Step ${currentStep + 1} `} />
          <CardContent>
            <MilestoneForm
              onButtonClick={handleButtonUpdateUI}
              status={statusForm}
              milestone={statusForm === 'Create' ? undefined : listMilestones[currentStep]}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

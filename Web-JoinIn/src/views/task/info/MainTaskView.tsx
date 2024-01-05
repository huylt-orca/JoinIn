import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
  CircularProgress
} from '@mui/material'
import { SetStateAction, useEffect, useState } from 'react'
import { importantLevel, importantLevelList } from 'src/constants/important-level'
import { listTaskStatusSelect, statusObj } from 'src/constants/task-status'
import { Task } from 'src/models/class'
import Editor from 'src/views/dialog/editor'
import TimeLineView from './TimelineView'
import AssignView from './AssignView'
import moment from 'moment'
import { groupAPI, taskAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { UpdateTaskModel } from 'src/models/query-models/UpdateTaskModel'

export interface IMainTaskViewProps {
  data: Task
  handleError: (error: any) => void
  notify: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
  onSuccess: () => Promise<void>
}

const DEFAULT_INPUT_WIDTH = 200
const MAX_INPUT_WIDTH = 700
const FONT_SIZE = 9

export default function MainTaskView({ data, handleError, notify, onSuccess }: IMainTaskViewProps) {
  const [value, setValues] = useState<Task>(new Task(data))
  const [editable, setEditable] = useState<boolean>(false)
  const [inputWidth, setInputWidth] = useState(DEFAULT_INPUT_WIDTH)
  const [description, setDescription] = useState(value.description)
  const [taskName, setTaskName] = useState<string>(data.name !== undefined ? data.name : '')
  const [isLeader, setIsLeader] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (taskName) {
      if (taskName.length * FONT_SIZE > DEFAULT_INPUT_WIDTH) {
        setInputWidth(
          (taskName.length + 1) * FONT_SIZE > MAX_INPUT_WIDTH ? MAX_INPUT_WIDTH : (taskName.length + 1) * FONT_SIZE
        )
      } else {
        setInputWidth(DEFAULT_INPUT_WIDTH)
      }
    }
  }, [taskName])

  useEffect(() => {
    console.log(
      moment().isAfter(moment(value.endDateDeadline).add('days', 1).format('yyyy-MM-DD')),
      moment(value.endDateDeadline).add('days', 1).format('yyyy-MM-DD'),
      moment().format('yyyy-MM-DD')
    )

    setValues(new Task(data))
    setTaskName(data.name ?? '')
  }, [data])

  const clickToEdit = () => {
    checkRole()
  }

  const checkRole = async () => {
    setIsLoading(true)
    data.group?.id &&
      (await groupAPI
        .getRoleInGroup(data.group?.id)
        .then(role => {
          const r = new CommonResponse(role).data

          setIsLeader(r === 'LEADER' || r === 'SUB_LEADER')
          setTimeout(() => {
            setIsLoading(false)
          }, 1000)
          setEditable(true)
        })
        .catch(error => {
          handleError(error)
          setTimeout(() => {
            setIsLoading(false)
          }, 1000)
        }))
  }

  const handleChange = (prop: string, event: any) => {
    const val = new Task(value)

    switch (prop) {
      case 'name':
        val.name = event.target.value
        break
      case 'impotantLevel':
        val.impotantLevel = event.target.value
        break
      case 'status':
        val.status = event.target.value
        break
      case 'estimatedDays':
        val.estimatedDays = Number(event.target.value) > 0 ? Number(event.target.value) : 1
        break
      default:
        break
    }

    setValues(val)
  }

  const clickCancelEdit = () => {
    setDescription(data.description)
    setEditable(false)
    setValues(new Task(data))
  }

  const clickSaveEdit = () => {
    const val: Task = new Task(value)
    value.name = taskName
    val.description = description

    const data = new UpdateTaskModel({
      id: val.id ?? '',
      name: val.name ?? '',
      description: description ?? '',
      endDateDeadline: new Date(val.endDateDeadline ?? '').toISOString(),
      startDateDeadline: new Date(val.startDateDeadline ?? '').toISOString(),
      estimatedDays: val.estimatedDays ?? 0,
      impotantLevel: importantLevel[val.impotantLevel ?? ''].valueNumber ?? 1,
      status: statusObj[val.status ?? ''].valueNumber ?? 0
    })

    setIsLoading(true)
    taskAPI
      .updateTask(data)
      .then(res => {
        setEditable(false)
        const response = new CommonResponse(res)
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
        notify(response.message ?? '', 'success')
        onSuccess()
      })
      .catch(error => {
        handleError(error)
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      })
  }

  const onChangeValue = async (task: Task) => {
    setValues(task)
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <Box>
        <CardHeader
          title={
            <Box mb={1}>
              <Grid container spacing={1} alignItems={'center'}>
                <Grid item>
                  {editable && isLeader ? (
                    <Box component='form' noValidate autoComplete='off'>
                      <TextField
                        id='input-main-task-name'
                        size='small'
                        autoComplete='off'
                        label='Task name'
                        value={value.name}
                        onChange={e => handleChange('name', e)}
                        InputProps={{
                          style: { width: `${inputWidth}px`, overflow: 'break-word' },
                          autoComplete: 'off'
                        }}
                        multiline
                      />
                    </Box>
                  ) : (
                    <Typography onClick={clickToEdit} fontWeight={500} variant='h5'>
                      {taskName}
                    </Typography>
                  )}
                </Grid>
                <Grid item ml={2}>
                  {editable && isLeader ? (
                    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
                      <InputLabel id='demo-select-small-label'>Important level</InputLabel>
                      <Select
                        labelId='demo-select-small-label'
                        id='demo-select-small'
                        value={value.impotantLevel}
                        label='Important Level'
                        onChange={e => handleChange('impotantLevel', e)}
                      >
                        {importantLevelList.map(val => {
                          return (
                            <MenuItem value={val.value} key={val.value}>
                              {val.lable}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  ) : (
                    <Chip
                      label={importantLevel[value?.impotantLevel ?? '']?.label}
                      color={importantLevel[value?.impotantLevel ?? '']?.color}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          }
          titleTypographyProps={{ variant: 'h6' }}
          subheader={
            <Box sx={{ marginLeft: 5 }}>
              <Grid container spacing={1} alignItems={'center'}>
                <Grid item>
                  <Typography variant='subtitle2'>Created by</Typography>
                </Grid>
                <Grid item>
                  <Chip
                    avatar={<Avatar alt='Natacha' src={value.createdBy?.avatar} />}
                    label={value.createdBy?.fullName ? value.createdBy?.fullName : 'created by'}
                    variant='outlined'
                  />
                </Grid>
                <Divider
                  orientation='vertical'
                  textAlign='left'
                  flexItem
                  style={{ height: '20px', width: '0.5px', borderColor: '#d4d2d5', marginLeft: '4px' }}
                />
                {editable && isLeader ? (
                  <Box component='form' noValidate autoComplete='off' m={1}>
                    <TextField
                      size='small'
                      autoComplete='off'
                      label='Estimate Days'
                      value={value.estimatedDays}
                      onChange={e => handleChange('estimatedDays', e)}
                      InputProps={{
                        style: { width: `${inputWidth}px`, overflow: 'break-word' },
                        autoComplete: 'off'
                      }}
                      type='number'
                    />
                  </Box>
                ) : (
                  <Box display={'flex'} alignItems={'center'}>
                    <Grid item m={1}>
                      <Typography variant='subtitle2'>Estimate </Typography>
                    </Grid>
                    <Grid item m={1}>
                      <Chip label={`${data.estimatedDays} Days`} variant='outlined' />
                    </Grid>
                  </Box>
                )}

                <Divider
                  orientation='vertical'
                  textAlign='left'
                  flexItem
                  style={{ height: '20px', width: '0.5px', borderColor: '#d4d2d5', marginLeft: '4px' }}
                />
                <Grid item>
                  {editable ? (
                    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
                      {editable ? <InputLabel id='status-select-label'>Status</InputLabel> : ''}
                      <Select
                        labelId='status-select-label'
                        id='demo-select-small'
                        value={value.status}
                        label={'Status'}
                        onChange={e => handleChange('status', e)}
                      >
                        {listTaskStatusSelect.map(val => {
                          return (
                            <MenuItem value={val.value} key={val.value}>
                              {val.lable}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  ) : (
                    <Chip
                      label={statusObj[value?.status ?? '']?.label}
                      color={statusObj[value?.status ?? '']?.color}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                      onClick={() => setEditable(true)}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          }
          action={
            editable ? (
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    aria-label='settings'
                    variant='outlined'
                    onClick={clickSaveEdit}
                    size='small'
                    style={{
                      width: '70px'
                    }}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    aria-label='settings'
                    variant='outlined'
                    onClick={() => clickCancelEdit()}
                    size='small'
                    color='error'
                    style={{
                      width: '70px'
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container>
                <Button aria-label='settings' variant='outlined' onClick={clickToEdit} size='small'>
                  Edit
                </Button>
              </Grid>
            )
          }
          sx={{
            paddingBottom: 2
          }}
        ></CardHeader>
      </Box>
      <Divider />
      <CardContent>
        <Grid container spacing={3} p={0}>
          <Grid
            item
            xs={5}
            sm={4}
            style={{
              translate: '-50px'
            }}
          >
            <TimeLineView data={value} editable={editable} isLeader={isLeader} changeValue={onChangeValue} />
          </Grid>
          <Divider
            orientation='vertical'
            textAlign='left'
            flexItem
            style={{ height: '300px', width: '0.5px', borderColor: '#d4d2d5', marginLeft: '4px' }}
          />
          <Grid item xs={6} sm={7}>
            {moment().isAfter(moment(data.endDateDeadline).add('days', 1).format('yyyy-MM-DD')) ? (
              <Grid item>
                <Alert severity='error'>
                  <AlertTitle>Fail</AlertTitle>
                  The task is late
                </Alert>
              </Grid>
            ) : null}
            <Grid item>
              <Box
                style={{
                  display: 'flex'
                }}
              >
                <Typography
                  fontWeight={500}
                  sx={{
                    marginTop: '10px'
                  }}
                >
                  Assignee
                </Typography>
              </Box>
              <Box component={'form'} autoComplete='off'>
                <AssignView data={value} />
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Typography mt={3} mb={3} fontWeight={500}>
              Description
            </Typography>
            {editable && isLeader ? (
              <div>
                <Editor
                  value={description}
                  name='description'
                  onChange={(dataChange: SetStateAction<string>) => {
                    setDescription(dataChange.toString())
                  }}
                />
              </div>
            ) : (
              <Box
                style={{ wordWrap: 'break-word', display: 'flex' }}
                border={1}
                padding={3}
                borderColor={'#d8d8d8'}
                borderRadius={1}
                boxShadow={2}
              >
                <div className='editor' dangerouslySetInnerHTML={{ __html: description! }} />
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            left: '0',
            bottom: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            zIndex: theme => theme.zIndex.drawer + 1
          }}
        >
          <CircularProgress size={40} color='info' />
        </Box>
      )}
    </Card>
  )
}

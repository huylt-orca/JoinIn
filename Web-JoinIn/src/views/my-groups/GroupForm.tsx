// ** React Imports
import { useState, ElementType, ChangeEvent, SetStateAction, useEffect, FC } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Icons Imports
import { Backdrop, CircularProgress, Divider, InputAdornment } from '@mui/material'
import { AccountGroup, AlphaACircleOutline, Book, InformationVariant, School, TownHall } from 'mdi-material-ui'
import Editor from '../dialog/editor'
import { useToasts } from 'react-toast-notifications'
import { GroupRequest } from 'src/models/query-models/GroupRequest'
import { groupAPI, userAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { groupDBDexie } from 'src/models/db/GroupDB'
import { Group } from 'src/models/class'
import { AxiosResponse } from 'axios'
import { groupValidation } from 'src/@core/utils/validation/group-validation'
import { ObjValidation } from 'src/@core/utils/validation'

interface State {
  id?: string
  groupName?: string
  schoolName?: string
  className?: string
  subject?: string
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
  objectFit: 'contain'
}))

const ImgBackgroundStyled = styled('img')(({ theme }) => ({
  width: '100%',
  height: 200,
  marginRight: theme.spacing(6.25),
  marginBottom: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
  objectFit: 'contain'
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

interface ChildComponentProps {
  onButtonClickClose?: () => void
  type: string
}

const GroupForm: FC<ChildComponentProps> = ({ onButtonClickClose, type }) => {
  // ** State
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [imgBackgroud, setImgBackground] = useState<string>('/images/cards/background-user.png')
  const [values, setValues] = useState<State>({
    id: '',
    groupName: '',
    schoolName: '',
    className: '',
    subject: ''
  })
  const [skills, setSkills] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [fileAvatar, setFileAvatar] = useState<FileList>()
  const [fileBackGround, setFileBackGround] = useState<FileList>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<ObjValidation>({})

  const addToast = useToasts()

  useEffect(() => {
    if (type !== 'CREATE') {
      getInformation()
    }
  }, [])

  const getInformation = async () => {
    try {
      const groupData = await groupDBDexie.getGroup()
      await groupAPI
        .getById(groupData?.id)
        .then(res => {
          const data = new CommonResponse(res)
          const group: Group = data.data

          setValues({
            id: group.id,
            groupName: group.name,
            schoolName: group.schoolName,
            className: group.className,
            subject: group.subjectName
          })
          setSkills(group.skill ?? '')
          setDescription(group.description ?? '')
          setImgBackground(group.theme ?? '/images/cards/background-user.png')
          setImgSrc(group.avatar ?? '/images/avatars/1.png')
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const onChangeAvatar = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)

      reader.readAsDataURL(files[0])
      setFileAvatar(files)
    }
  }

  const onChangeBackground = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgBackground(reader.result as string)

      reader.readAsDataURL(files[0])
      setFileBackGround(files)
    }
  }

  const uploadImage = async (): Promise<any> => {
    const response = await userAPI.uploadImage(fileAvatar ? fileAvatar[0] : undefined)

    return new CommonResponse(response as AxiosResponse).data
  }

  const uploadBackground = async (): Promise<any> => {
    const response = await userAPI.uploadImage(fileBackGround ? fileBackGround[0] : undefined)

    return new CommonResponse(response as AxiosResponse).data
  }

  const handleCreateGroup = async () => {
    try {
      setIsLoading(true)
      const urlAvatar = await uploadImage()
      const urlBackground = await uploadBackground()

      const group: any = groupValidation({
        Id: values.id,
        Name: values.groupName,
        SchoolName: values.schoolName?.length === 0 ? null : values.schoolName,
        ClassName: values.className?.length === 0 ? null : values.className,
        SubjectName: values.subject?.length === 0 ? null : values.subject,
        Description: description?.length === 0 ? null : description,
        Skill: skills?.length === 0 ? null : skills,
        Avatar: urlAvatar?.length === 0 ? null : urlAvatar,
        Theme: urlBackground?.length === 0 ? null : urlBackground
      } as GroupRequest)

      if (group.isError) {
        setIsLoading(false)
        setError(group.result)

        return
      }
      if (type === 'CREATE') {
        await groupAPI
          .post(group)
          .then(async res => {
            const data = new CommonResponse(res)
            addToast.addToast(data.message, { appearance: 'success' })
            onButtonClickClose && onButtonClickClose()
          })
          .catch(error => {
            console.log('Application Form: ', error)
          })
      } else {
        await groupAPI
          .put(group)
          .then(async res => {
            const data = new CommonResponse(res)
            addToast.addToast(data.message, { appearance: 'success' })
            onButtonClickClose && onButtonClickClose()
          })
          .catch(error => {
            console.log('Application Form: ', error)
          })
      }
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleReset = () => {
    if (type === 'CREATE') {
      setValues({
        id: '',
        groupName: '',
        schoolName: '',
        className: '',
        subject: ''
      })
      setSkills('')
      setDescription('')
      setImgBackground('/images/cards/background-user.png')
      setImgSrc('/images/avatars/1.png')
    } else {
      getInformation()
    }
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12}>
            <TextField
              error={error.Name?.isError}
              fullWidth
              label='Group Name'
              placeholder='Group Name'
              value={values.groupName}
              onChange={handleChange('groupName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AccountGroup />
                  </InputAdornment>
                )
              }}
              helperText={error.Name?.isError ? error.Name?.error : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='School Name'
              value={values.schoolName}
              placeholder='School Name'
              onChange={handleChange('schoolName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <TownHall />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={error.ClassName?.isError}
              helperText={error.ClassName?.isError ? error.ClassName?.error : ''}
              fullWidth
              label='Class Name'
              value={values.className}
              placeholder='Class Name'
              onChange={handleChange('className')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <School />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={error.SubjectName?.isError}
              helperText={error.SubjectName?.isError ? error.SubjectName?.error : ''}
              fullWidth
              label='Subject'
              placeholder='Subject'
              value={values.subject}
              onChange={handleChange('subject')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Book />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <AlphaACircleOutline sx={{ marginRight: 1 }} />
              <Typography variant='body1'>Skills</Typography>
            </Box>
            <Editor
              name='skill'
              value={skills}
              onChange={(dataChange: SetStateAction<string>) => {
                setSkills(dataChange.toString())
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <InformationVariant sx={{ marginRight: 1 }} />
              <Typography variant='body1'>Description</Typography>
            </Box>
            <Editor
              name='description'
              value={description}
              onChange={(dataChange: SetStateAction<string>) => {
                setDescription(dataChange.toString())
              }}
            />
          </Grid>

          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload Logo
                  <input
                    hidden
                    type='file'
                    onChange={onChangeAvatar}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <ImgBackgroundStyled src={imgBackgroud} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-background'>
                  Upload Background
                  <input
                    hidden
                    type='file'
                    onChange={onChangeBackground}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-background'
                  />
                </ButtonStyled>
                <ResetButtonStyled
                  color='error'
                  variant='outlined'
                  onClick={() => setImgBackground('/images/cards/background-user.png')}
                >
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mb: 7 }} />
            <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleCreateGroup}>
              {type}
            </Button>
            <Button type='reset' variant='outlined' color='secondary' onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </CardContent>
  )
}

export default GroupForm

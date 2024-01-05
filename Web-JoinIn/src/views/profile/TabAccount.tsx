// ** React Imports
import { useState, ElementType, ChangeEvent, SetStateAction, useEffect, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icons Imports
import {
  Autocomplete,
  Backdrop,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup
} from '@mui/material'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { AccountOutline, AlphaACircleOutline, Calendar, Contacts, InformationVariant, Phone } from 'mdi-material-ui'
import Editor from '../dialog/editor'
import { Major, User } from 'src/models/class'
import { majorAPI, userAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { useRouter } from 'next/router'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { StorageKeys } from 'src/constants'
import { UserCompleteProfileModel } from 'src/models/query-models/UserCompleteProfileModel'
import { AxiosError, AxiosResponse } from 'axios'
import { useToasts } from 'react-toast-notifications'
import { userDBDexie } from 'src/models/db/UserDB'
import { validateProfile } from 'src/@core/utils/validation/profile-validation'
import { ObjValidation } from 'src/@core/utils/validation'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 150,
  height: 150,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ImgBackgroundStyled = styled('img')(({ theme }) => ({
  width: '100%',
  height: 200,
  marginRight: theme.spacing(6.25),
  marginBottom: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
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

interface TabAccountProps {
  code?: string
  handleError?: (error: any) => void
  actionProfile?: ReactNode
  exitEdit?: (value: boolean) => void
}

const TabAccount = (props: TabAccountProps) => {
  // ** State
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [imgBackgroud, setImgBackground] = useState<string>('/images/cards/background-user.png')
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [selectedMajor, setSelectedMajor] = useState<Major[]>([])
  const [description, setDescription] = useState('')
  const [contacts, setContacts] = useState('')
  const [skills, setSkills] = useState('')
  const [majorOptions, setMajorOptions] = useState<Major[]>([])
  const [fullName, setFullName] = useState<string>('')
  const [phone, setPhone] = useState<string>()
  const [gender, setGender] = useState<string>()
  const [fileAvatar, setFileAvatar] = useState<FileList>()
  const [fileBackGround, setFileBackGround] = useState<FileList>()
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<ObjValidation>({})

  const router = useRouter()
  const addToast = useToasts()

  useEffect(() => {
    fetchData()
  }, [props])

  const fetchData = async () => {
    await userDBDexie.getToken().then(async res => {
      if (res) {
        setIsLogin(true)
        await userAPI
          .getProfile()
          .then(async res => {
            const commonResponse = new CommonResponse(res)
            const data = new User(commonResponse.data)
            await majorAPI.getAllMajorOfUser().then(async majors => {
              const listMajor: Major[] = new CommonResponse(majors).data
              await getAllMajor(listMajor)
            })
            if (commonResponse.status === 200) {
              setFullName(data.fullName ?? '')
              setDate(new Date(data.birthDay?.toString() ?? new Date().toString()))
              setImgSrc(data.avatar ?? '')
              setImgBackground(data.theme ?? '')
              setDescription(data.description ?? '')
              setContacts(data.otherContact ?? '')
              setSkills(data.skill ?? '')
              setGender(data.gender ? 'male' : 'female')
              setPhone(data.phone ?? '')
            }
          })
          .catch(error => {
            props.handleError && props.handleError(error)
          })
      } else {
        setIsLogin(false)
        await getAllMajor([])
      }
    })
  }

  const getAllMajor = async (majorsOfUser: Major[]) => {
    await majorAPI
      .getList()
      .then(res => {
        const data = new CommonResponse(res).data as Major[]
        const list: Major[] = []
        majorsOfUser.map(item => {
          const tmp = data.filter(val => val.id === item.id).at(0)
          tmp && list.push(tmp)
        })

        setSelectedMajor(list)
        setMajorOptions(data)
      })
      .catch(error => {
        if ((error as AxiosError)?.response?.status === 401) {
          notify('Login expired.', 'error')
          router.push('/user/logout')
        } else {
          console.log(error)
        }
      })
  }

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
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

  const getSouceNumber = (): 0 | 1 | 2 => {
    const source = router.query.utm_source
    if ((source as unknown as string) === 'facebook') {
      return 0
    }

    if ((source as unknown as string) === 'tiktok') {
      return 1
    }

    return 2
  }

  const onSaveProfile = async () => {
    setIsLoading(true)
    const payload = validateProfile(
      new UserCompleteProfileModel({
        birthDay: moment(date?.toString()).format(StorageKeys.KEY_FORMAT_DATE),
        description: description,
        fullName: fullName,
        gender: gender === 'male',
        majorIdList: (selectedMajor as Major[])?.map(item => item.id ?? ''),
        skill: skills,
        otherContact: contacts,
        phoneNumber: phone,
        platForm: getSouceNumber()
      })
    )

    if (payload.isError) {
      console.log(payload)
      setError(payload.result)
      setIsLoading(false)

      return
    }

    console.log(router.query.utm_source, payload, getSouceNumber())

    await userAPI
      .uploadImage(fileAvatar ? fileAvatar[0] : undefined)
      .then(async res => {
        let urlAvatar = ''
        if (typeof res !== 'boolean') {
          urlAvatar = new CommonResponse(res as AxiosResponse).data
        } else {
          urlAvatar = imgSrc
        }

        await userAPI
          .uploadImage(fileBackGround ? fileBackGround[0] : undefined)
          .then(async resfileBackGround => {
            let urlBackground = ''
            if (typeof resfileBackGround !== 'boolean') {
              urlBackground = new CommonResponse(resfileBackGround as AxiosResponse).data
            } else {
              urlBackground = imgBackgroud
            }

            const newProfile = new UserCompleteProfileModel(payload)
            newProfile.avatar = urlAvatar
            newProfile.theme = urlBackground

            await submitProfile(newProfile).catch(error => {
              if ((error as AxiosError)?.response?.status === 401) {
                notify('Login expired.', 'error')
                router.push('/user/logout')
              } else {
                console.log(error)
              }
            })
          })
          .catch(error => {
            if ((error as AxiosError)?.response?.status === 401) {
              notify('Login expired.', 'error')
              router.push('/user/logout')
            } else {
              console.log(error)
            }
          })
      })
      .catch(error => {
        if ((error as AxiosError)?.response?.status === 401) {
          notify('Login expired.', 'error')
          router.push('/user/logout')
        } else {
          console.log(error)
        }
      })
    setIsLoading(false)
  }

  const submitProfile = (payload: UserCompleteProfileModel) => {
    setIsLoading(true)
    if (isLogin) {
      return userAPI.put(payload).then(async rescompleteProfile => {
        const data = new CommonResponse(rescompleteProfile)
        notify(data.message ?? '', 'success'), props.exitEdit && props.exitEdit(false)
      })
    } else {
      return userAPI.completeProfile(payload, props.code ?? '').then(async rescompleteProfile => {
        const token: string = new CommonResponse(rescompleteProfile).data
        if (await userDBDexie.saveToken(token)) {
          await getUserInforToSaveDB(token)
          router.push('/my-groups')
        }
      })
    }
  }

  const getUserInforToSaveDB = async (token: string) => {
    try {
      const value: User = await new Promise((resolve, reject) => {
        userAPI
          .getProfile()
          .then(res => {
            const data = new CommonResponse(res)
            const user: User = data.data

            resolve(user)
          })
          .catch(err => {
            reject(err)
          })
      })

      await userDBDexie.saveUser({
        id: value.id,
        name: value.fullName,
        avatar: value.avatar,
        token: token
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Avatar
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
          <Grid item xs={12} sm={6} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <ImgBackgroundStyled src={imgBackgroud} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-background'>
                  Upload New Background
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='FullName *'
              value={fullName}
              placeholder='FullName'
              defaultValue='John Doe'
              onChange={e => setFullName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AccountOutline />
                  </InputAdornment>
                )
              }}
              error={error.fullName?.isError}
              helperText={error.fullName?.isError ? error.fullName?.error : ''}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <DatePicker
                selected={date}
                showYearDropdown
                showMonthDropdown
                id='account-settings-date'
                placeholderText='YYYY-MM-DD'
                customInput={
                  <TextField
                    error={error.birthDay?.isError}
                    helperText={error.birthDay?.isError ? error.birthDay?.error : ''}
                    label='Birth Date'
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Calendar />
                        </InputAdornment>
                      )
                    }}
                  />
                }
                maxDate={new Date(`${moment().year() - 15}-12-31`)}
                minDate={new Date(`${moment().year() - 100}-12-31`)}
                onChange={(date: Date) => setDate(date)}
                dateFormat={'yyyy-MM-dd'}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              value={majorOptions.filter(option => selectedMajor?.indexOf(option) !== -1)}
              options={majorOptions.filter(option => selectedMajor?.indexOf(option) === -1)}
              getOptionLabel={option => `${option.shortName} - ${option.name ?? 'No name'}`}
              onChange={(event, value) => setSelectedMajor(value)}
              renderInput={params => <TextField {...params} label='Major *' variant='outlined' />}
            />
            {error.majorIdList?.isError && (
              <FormHelperText error id='error'>
                {error.majorIdList?.error}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label='Phone'
              placeholder='(123) 456-7890'
              onChange={e => setPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Phone />
                  </InputAdornment>
                )
              }}
              value={phone}
              error={error.phoneNumber?.isError}
              helperText={error.phoneNumber?.isError ? error.phoneNumber?.error : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
              <RadioGroup
                row
                defaultValue={gender}
                aria-label='gender'
                name='account-settings-info-radio'
                onChange={e => {
                  setGender(e.target.value)
                }}
                value={gender}
              >
                <FormControlLabel
                  value='male'
                  label='Male'
                  control={<Radio checked={gender === 'male' || gender?.length === 0 || !gender} />}
                />
                <FormControlLabel value='female' label='Female' control={<Radio checked={gender === 'female'} />} />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Contacts sx={{ marginRight: 1 }} />
              <Typography variant='body1'>Other Contacts</Typography>
            </Box>
            {error.otherContact?.isError ? (
              <p
                className='MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-1sxd8vz-MuiFormHelperText-root'
                id='mui-17-helper-text'
              >
                {error.otherContact?.error}
              </p>
            ) : (
              ''
            )}
            <Editor
              name='contacts'
              value={contacts}
              onChange={(dataChange: SetStateAction<string>) => {
                setContacts(dataChange.toString())
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <AlphaACircleOutline sx={{ marginRight: 1 }} />
              <Typography variant='body1'>Your skills</Typography>
            </Box>
            {error.skill?.isError ? (
              <p
                className='MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-1sxd8vz-MuiFormHelperText-root'
                id='mui-17-helper-text'
              >
                {error.skill?.error}
              </p>
            ) : (
              ''
            )}
            <Editor
              name='skills'
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
            {error.description?.isError ? (
              <p
                className='MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-1sxd8vz-MuiFormHelperText-root'
                id='mui-17-helper-text'
              >
                {error.description?.error}
              </p>
            ) : (
              ''
            )}
            <Editor
              name='description'
              value={description}
              onChange={(dataChange: SetStateAction<string>) => {
                setDescription(dataChange.toString())
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={onSaveProfile}>
              Save Changes
            </Button>
            {!router.pathname.includes('initialization') ? (
              <Button type='reset' sx={{ marginRight: 3.5 }} variant='outlined' color='info'>
                Reset
              </Button>
            ) : null}
            {props.actionProfile && props.actionProfile}
          </Grid>
        </Grid>
      </form>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </CardContent>
  )
}

export default TabAccount

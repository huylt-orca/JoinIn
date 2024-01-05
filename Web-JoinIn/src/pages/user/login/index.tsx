// ** React Imports
import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { Grid } from '@mui/material'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

import * as yup from 'yup'
import { Message, QueryKeys } from 'src/constants'
import { authAPI, userAPI } from 'src/api-client'
import MyLogo from 'src/layouts/components/MyLogo'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { userDBDexie } from 'src/models/db/UserDB'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Backdrop, CircularProgress } from '@mui/material'
import jwt_decode from 'jwt-decode'
import { JWTModel } from 'src/models/common/JWTModel'
import { User } from 'src/models/class'

interface State {
  email: string
  password: string
  showPassword: boolean
  messageError: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    email: '',
    password: '',
    showPassword: false,
    messageError: ''
  })
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()
  const source = router.query.utm_source
  const addToast = useToasts()
  const { data, status } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  useEffect(() => {
    try {
      setIsLoading(true)
      userDBDexie.getToken().then(value => {
        if (value?.length !== 0) {
          const tokenModel = new JWTModel(jwt_decode(value ?? ''))
          if (router.pathname.startsWith('/admin')) {
            if (tokenModel.role !== 'Admin') {
              userDBDexie.clearToken().then(() => {
                setIsLoading(false)
                router.push('/user/login?back=1', '/user/login')
              })

              return
            }
            router.push('/admin/dashboard/')
          } else {
            if (tokenModel.role !== 'User') {
              userDBDexie.clearToken().then(() => {
                setIsLoading(false)
                router.push('/user/login?back=1', '/user/login')
              })

              return
            }
            router.push('/my-groups')
          }
        } else {
          userDBDexie.getGoogleToken().then(res => {
            if (res?.length !== 0) {
              getToken(res ?? '')
            } else if (!router.query.back) {
              if (data?.user?.name && status === 'authenticated') {
                getToken(data.user.name)
              } else {
                setIsLoading(false)
              }
            } else {
              setIsLoading(false)
            }
          })
        }
      })
    } catch (err) {
      console.error(err)
      handleError();
    }
  }, [data, status])

  const getToken = (gooleToken: string) => {
    authAPI
      .getTokenLoginGoogle(gooleToken)
      .then(async res => {
        const commonResponse = new CommonResponse(res)
        const token: string = commonResponse.data
        if (token === 'Unverify') {
          notify('Your account is not verify. Email verify is sent', 'warning')
          authAPI.sendVerifyEmail(values.email, source as unknown as string)
        } else {
          if (token.indexOf('/profile/initialization') > -1) {
            const url = `${token}&utm_source=${source}`
            router.push(url)
          } else if (await userDBDexie.saveToken(token)) {
            debugger
            const tokenModel = new JWTModel(jwt_decode(token ?? ''))
            await getUserInforToSaveDB(token)
            if (tokenModel.role === 'Admin') {
              router.push('/admin/dashboard/')
            } else {
              router.push('/my-groups')
            }
          }
        }
      })
      .catch(error => {
        console.log('authAPI', error)
        if (error?.response?.data?.message === 'Unverify user.') {
          router.push(error?.response?.data?.data)
        } else {
          setValues({ ...values, messageError: error?.response?.data?.message })
          notify(error?.response?.data?.message, 'error')
        }
      })
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

  const emailValidate = yup.object().shape({
    email: yup
      .string()
      .email(Message.INVALID_EMAIL)
      .required(Message.EMAIL_REQUIRED)
      .matches(QueryKeys.EMAIL_REGEX, Message.INVALID_EMAIL)
  })

  const passwordValidate = yup.object().shape({
    password: yup
      .string()
      .min(8, Message.PASSWORD_LENGTH)
      .max(30, Message.PASSWORD_LENGTH)
      .required(Message.PASSWORD_REQUIRED)
  })

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    let isError = false
    console.log('email: ', values.email, 'password: ', values.password)
    await emailValidate
      .validate({ email: values.email })
      .then(() => {
        setEmailError('')
      })
      .catch(err => {
        isError = true
        setEmailError(err.errors)
      })

    await passwordValidate
      .validate({ password: values.password })
      .then(() => {
        setPasswordError('')
      })
      .catch(err => {
        isError = true
        setPasswordError(err.errors)
      })

    if (isError) {
      setIsLoading(false)

      return
    }
    const user: any = { userName: values.email, password: values.password }

    try {
      await authAPI
        .login(user)
        .then(async res => {
          const token: string = new CommonResponse(res).data
          if (token === 'Unverify') {
            notify('Your account is not verify. Email verify is sent', 'warning')
            authAPI.sendVerifyEmail(values.email, source as unknown as string)
          } else {
            if (await userDBDexie.saveToken(token)) {
              const tokenModel = new JWTModel(jwt_decode(token ?? ''))
              await getUserInforToSaveDB(token)
              if (tokenModel.role === 'Admin') {
                router.push('/admin/dashboard/')
              } else {
                router.push('/my-groups')
              }
            }
          }
        })
        .catch(error => {
          console.log('authAPI', error)
          setIsLoading(false)

          if (error?.response?.data?.message) {
            setValues({ ...values, messageError: error?.response?.data?.message })
            notify(error?.response?.data?.message, 'error')
          }
        })
    } catch (error: any) {
      setIsLoading(false)
      console.log('login page', error)
    }
  }

  const handleError = async () => {
    if (status === 'authenticated') {
      await signOut()
    }
    await userDBDexie.clearToken()
  }

  const handleSignIn = async () => {
    await signIn('google')
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MyLogo width='50' height='50' />
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <FormControl fullWidth margin='dense'>
              <InputLabel htmlFor='auth-login-email'>Email</InputLabel>
              <OutlinedInput
                error={emailError.length > 0}
                label='Email'
                value={values.email}
                id='auth-login-email'
                onChange={handleChange('email')}
                type='email'
                required={true}
              />
              {emailError.length > 0 && (
                <FormHelperText error id='password-error'>
                  {emailError}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth margin='dense'>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                error={passwordError.length > 0}
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {passwordError.length > 0 && (
                <FormHelperText error id='password-error'>
                  {passwordError}
                </FormHelperText>
              )}
            </FormControl>
            <Grid container sx={{ mb: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <Grid item sm={12} md={12}>
                <FormHelperText error id='login-error'>
                  <Typography color={'error'}>{values.messageError}</Typography>
                </FormHelperText>
              </Grid>
              <FormControlLabel control={<Checkbox />} label='Remember Me' />
              <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
              </Link>
            </Grid>
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} onClick={() => handleSubmit()}>
              Login
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href={`/user/register?utm_source=${source}`}>
                  <LinkStyled>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}>or</Divider>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Google sx={{ color: '#db4437' }} />
                </IconButton>
              </Link>
            </Box> */}
            <Button fullWidth size='large' variant='outlined' sx={{ marginBottom: 7 }} onClick={() => handleSignIn()}>
              {/* <Google sx={{ marginRight: '10px' }} /> */}
              <svg
                width={30}
                height={30}
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                viewBox='0 0 48 48'
              >
                <defs>
                  <path
                    id='a'
                    d='M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z'
                  />
                </defs>
                <clipPath id='b'>
                  <use xlinkHref='#a' overflow='visible' />
                </clipPath>
                <path clipPath='url(#b)' fill='#FBBC05' d='M0 37V11l17 13z' />
                <path clipPath='url(#b)' fill='#EA4335' d='M0 11l17 13 7-6.1L48 14V0H0z' />
                <path clipPath='url(#b)' fill='#34A853' d='M0 37l30-23 7.9 1L48 0v48H0z' />
                <path clipPath='url(#b)' fill='#4285F4' d='M48 48L17 24l-4-3 35-10z' />
              </svg>
              <Typography fontWeight='bold' marginLeft={5}>
                Login with Google
              </Typography>
            </Button>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage

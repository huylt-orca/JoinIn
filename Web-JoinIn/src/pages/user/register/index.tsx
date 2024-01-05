// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { signIn, useSession } from 'next-auth/react'
import { Backdrop, CircularProgress } from '@mui/material'

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
import { useRouter } from 'next/router'
import MyLogo from 'src/layouts/components/MyLogo'
import { AxiosError } from 'axios'
import { useToasts } from 'react-toast-notifications'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { ValueValidation } from 'src/@core/utils/validation'
import { userDBDexie } from 'src/models/db/UserDB'
import { JWTModel } from 'src/models/common/JWTModel'
import { User } from 'src/models/class'
import jwt_decode from 'jwt-decode'

interface State {
  password: string
  passwordConfirm: string
  email: string
  showPassword: boolean
  showPasswordConfirm: boolean
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
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  // ** States
  const [values, setValues] = useState<State>({
    showPassword: false,
    showPasswordConfirm: false,
    email: '',
    password: '',
    passwordConfirm: ''
  })
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const { data, status } = useSession()
  const addToast = useToasts()
  const router = useRouter()
  const source = router.query.utm_source

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleClickShowPasswordConfirm = () => {
    setValues({ ...values, showPasswordConfirm: !values.showPasswordConfirm })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  useEffect(() => {
    if (data?.user?.name && status === 'authenticated') {
      getToken(data.user.name)
    }
  }, [data, status])

  const getToken = (gooleToken: string) => {
    authAPI
      .getTokenLoginGoogle(gooleToken)
      .then(async res => {
        const token: string = new CommonResponse(res).data
        if (token === 'Unverify') {
          notify('Your account is not verify. Email verify is sent', 'warning')
          authAPI.sendVerifyEmail(values.email, source as unknown as string)
        } else {
          const tmp: string = JSON.stringify(res)
          if (tmp.indexOf('/profile/initialization') > -1) {
            router.push(`${tmp}&utm_source=${source}`)
          } else if (await userDBDexie.saveToken(token)) {
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

  const handleSubmit = async () => {
    setIsLoading(true)
    let isError = false
    await emailValidate
      .validate({ email: values.email })
      .then(() => {
        setEmailError('')
      })
      .catch(err => {
        isError = true
        setEmailError(err.errors)
      })

    const password: ValueValidation = new ValueValidation({
      key: 'Password',
      value: values.password
    }).isPassword()

    if (password.isError) {
      isError = true
      setPasswordError(password.error)
    } else {
      setPasswordError('')
      if (values.password != values.passwordConfirm) {
        isError = true
        setPasswordConfirmError(Message.CONFIRM_NOT_MATCH)
      } else {
        setPasswordConfirmError('')
      }
    }

    if (isError) {
      setIsLoading(false)

      return
    }
    const user = {
      email: values.email,
      password: values.password
    }

    authAPI
      .signUp(user, router.query.utm_source as unknown as string)
      .then(() => {
        router.push(`/user/logout?utm_source=${source}`, `/user/login?utm_source=${source}`)
      })
      .catch(error => {
        console.log(error)

        if ((error as AxiosError)?.response?.status === 400) {
          const commonResposne = new CommonResponse((error as AxiosError)?.response?.data as CommonResponse)
          notify(commonResposne.message ?? 'Error', 'error')
        } else {
          console.log(error)
        }
        setIsLoading(false)
      })
  }

  const handleSignIn = () => {
    setIsLoading(true)

    signIn('google')
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
              Adventure starts here 🚀
            </Typography>
            <Typography variant='body2'>Make your app management easy and fun!</Typography>
          </Box>
          <form noValidate autoComplete='on' onSubmit={e => e.preventDefault()}>
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel error={emailError.length > 0} htmlFor='auth-register-email'>
                Email
              </InputLabel>
              <OutlinedInput
                error={emailError.length > 0}
                label='Email'
                value={values.email}
                id='auth-register-password'
                onChange={handleChange('email')}
                type='text'
              />
              {emailError.length > 0 && (
                <FormHelperText error id='email-error'>
                  {emailError}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel error={passwordError.length > 0} htmlFor='auth-register-password'>
                Password
              </InputLabel>
              <OutlinedInput
                error={passwordError.length > 0}
                label='Password'
                value={values.password}
                id='auth-register-password'
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
                      {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
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
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel error={passwordConfirmError.length > 0} htmlFor='auth-register-password-confirm'>
                Confirm
              </InputLabel>
              <OutlinedInput
                label='Confirm'
                error={passwordConfirmError.length > 0}
                value={values.passwordConfirm}
                id='auth-register-password-confirm'
                onChange={handleChange('passwordConfirm')}
                type={values.showPasswordConfirm ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPasswordConfirm}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPasswordConfirm ? (
                        <EyeOutline fontSize='small' />
                      ) : (
                        <EyeOffOutline fontSize='small' />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {passwordConfirmError.length > 0 && (
                <FormHelperText error id='password-confirm-error'>
                  {passwordConfirmError}
                </FormHelperText>
              )}
            </FormControl>
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Fragment>
                  <span>I agree to </span>
                  <Link href='/' passHref>
                    <LinkStyled onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                      privacy policy & terms
                    </LinkStyled>
                  </Link>
                </Fragment>
              }
            />
            <Button
              fullWidth
              size='large'
              type='button'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={handleSubmit}
            >
              Sign up
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href={`/user/login?utm_source=${source}&back=1`}>
                  <LinkStyled>Sign in instead</LinkStyled>
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}>or</Divider>
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

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage

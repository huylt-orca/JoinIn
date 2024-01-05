// ** React Imports
import { useState, ChangeEvent, MouseEvent, ReactNode } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

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
import { Message } from 'src/constants'
import { authAPI } from 'src/api-client'
import { useRouter } from 'next/router'
import { User } from 'src/models/class'
import MyLogo from 'src/layouts/components/MyLogo'

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

const ForgotPassPage = () => {
  // ** States
  const [values, setValues] = useState<State>({
    showPassword: false,
    showPasswordConfirm: false,
    email: '',
    password: '',
    passwordConfirm: ''
  })

  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')

  const router = useRouter()

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

  const passwordValidate = yup.object().shape({
    password: yup
      .string()
      .min(8, Message.PASSWORD_LENGTH)
      .max(30, Message.PASSWORD_LENGTH)
      .required(Message.PASSWORD_REQUIRED)
  })

  const passwordConfirmValidate = yup.object().shape({
    passwordConfirm: yup
      .string()
      .min(8, Message.CONFIRM_LENGTH)
      .max(30, Message.CONFIRM_LENGTH)
      .required(Message.CONFIRM_REQUIRED)
  })

  const handleSubmit = async () => {
    let isError = false

    await passwordValidate
      .validate({ password: values.password })
      .then(async () => {
        setPasswordError('')
        await passwordConfirmValidate
          .validate({ passwordConfirm: values.passwordConfirm })
          .then(() => {
            if (values.password != values.passwordConfirm) {
              isError = true
              setPasswordConfirmError(Message.CONFIRM_NOT_MATCH)
            } else {
              setPasswordConfirmError('')
            }
          })
          .catch(err => {
            isError = true
            setPasswordConfirmError(err.errors)
          })
      })
      .catch(err => {
        isError = true
        setPasswordError(err.errors)
        setPasswordConfirmError('')
      })

    console.log(isError, passwordConfirmError)

    if (isError) {
      return
    }
    const user = new User({
      email: values.email,
      password: values.password
    })
    authAPI
      .signUp(user, '')
      .then()
      .catch(() => {
        router.push('/')
      })
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
              Forgot Password
            </Typography>
            <Typography variant='body2'>Pls write password in paper</Typography>
          </Box>
          <form noValidate autoComplete='on' onSubmit={e => e.preventDefault()}>
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel error={passwordError.length > 0} htmlFor='auth-register-password'>
                New Password
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
            <Button
              fullWidth
              size='large'
              type='button'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={handleSubmit}
            >
              Change
            </Button>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

ForgotPassPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ForgotPassPage

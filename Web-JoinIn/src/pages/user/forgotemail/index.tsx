// ** React Imports
import { useState, ChangeEvent, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

import * as yup from 'yup'
import { Message, QueryKeys } from 'src/constants'
import MyLogo from 'src/layouts/components/MyLogo'
import withAuth from 'src/pages/withAuth'

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

const ForgotEmailPage = () => {
  // ** States
  const [values, setValues] = useState<State>({
    showPassword: false,
    showPasswordConfirm: false,
    email: '',
    password: '',
    passwordConfirm: ''
  })
  const [emailError, setEmailError] = useState('')

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const emailValidate = yup.object().shape({
    email: yup
      .string()
      .email(Message.INVALID_EMAIL)
      .required(Message.EMAIL_REQUIRED)
      .matches(QueryKeys.EMAIL_REGEX, Message.INVALID_EMAIL)
  })

  const handleSubmit = async () => {
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

    if (isError) {
      return
    }
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
            <Typography variant='body2'>Enter Email to get Password throught mail.</Typography>
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
            <Button
              fullWidth
              size='large'
              type='button'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Do you remember password?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/user/login'>
                  <LinkStyled>Sign in</LinkStyled>
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}>or</Divider>
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }}>
              <Google sx={{ color: '#FFFFFF', marginRight: '10px' }} />
              <Typography fontWeight='bold' color='#FFFFFF'>
                Login with Google
              </Typography>
            </Button>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

ForgotEmailPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default withAuth(ForgotEmailPage)

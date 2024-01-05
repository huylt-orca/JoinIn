// ** React Imports
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { CircularProgress, TextField } from '@mui/material'
import { ShieldCheck } from 'mdi-material-ui'
import { userAPI } from 'src/api-client'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import { AxiosError } from 'axios'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { ObjValidation } from 'src/@core/utils/validation'
import { validateUpdatePassword } from 'src/@core/utils/validation/update-password-validation'

interface State {
  newPassword: string
  currentPassword: string
  showNewPassword: boolean
  confirmNewPassword: string
  showCurrentPassword: boolean
  showConfirmNewPassword: boolean
}

const TabSecurity = () => {
  // ** States
  const [values, setValues] = useState<State>({
    newPassword: '',
    currentPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })
  const [verifyToken, setVerifyToken] = useState<string>('')
  const [countDown, setCountDown] = useState<number>(120)
  const [isSend, setIsSend] = useState<boolean>(false)
  const [firstSend, setFirstSend] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ObjValidation>({})
  const router = useRouter()
  const addToast = useToasts()

  useEffect(() => {
    if (isSend) {
      const timer = setTimeout(() => {
        setCountDown(countDown - 1)
      }, 1000)
      console.log(countDown)

      if (countDown === 0 || !isSend) {
        clearTimeout(timer)
        setIsSend(false)
      }
    }
  }, [isSend, countDown])

  const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    addToast.addToast(message, { appearance: type })
  }

  // Handle New Password
  const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }
  const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Confirm New Password
  const handleConfirmNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }
  const handleMouseDownConfirmNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSubmit = async () => {
    const checkError = validateUpdatePassword({
      confirmPassword: values.confirmNewPassword,
      newPassword: values.newPassword,
      verifyToken: verifyToken
    })

    if (checkError.isError) {
      setError(checkError?.result)

      return
    } else {
      setError({})
    }

    await userAPI
      .updatePassword({
        password: values.newPassword.trim(),
        verifyCode: verifyToken
      })
      .then(res => {
        const response = new CommonResponse(res)
        if (response.status === 200) {
          notify(response.message ?? '', 'success')
          router.push('/user/logout', '/user/login')
        }
      })
      .catch(error => handleError(error))
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

  return (
    <CardContent sx={{ paddingBottom: 0 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={5}>
            <Grid item xs={12} container sx={{ marginTop: 6 }} spacing={3} alignItems={'center'}>
              <Grid item sm={8}>
                <FormControl>
                  <TextField
                    id='verify-code'
                    name='verify-code'
                    fullWidth
                    value={verifyToken}
                    label='Verify Code'
                    placeholder='Verify Code'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <ShieldCheck color='success' />
                        </InputAdornment>
                      )
                    }}
                    onChange={e => setVerifyToken(e.target.value)}
                    error={error.verifyToken?.isError}
                    helperText={error.verifyToken?.error}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={4} sx={{ position: 'relative' }}>
                {loading && (
                  <CircularProgress
                    size={24}
                    color='info'
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-6px',
                      marginLeft: '-12px'
                    }}
                  />
                )}
                {!firstSend ? (
                  <Button
                    variant='outlined'
                    onClick={() => {
                      setLoading(true)
                      userAPI
                        .getVerifyCode()
                        .then(() => {
                          notify('Send email scuccessfully.', 'success')
                          setIsSend(true)
                          setLoading(false)
                          setFirstSend(true)
                        })
                        .catch(error => {
                          console.log(error)
                          setIsSend(false)
                          setFirstSend(false)
                        })
                    }}
                    disabled={isSend || firstSend || loading}
                    size='small'
                  >
                    Get verify code
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant='outlined'
                    onClick={() => {
                      if (countDown === 0) {
                        setLoading(true)
                        userAPI
                          .getVerifyCode()
                          .then(() => {
                            notify('Send email scuccessfully.', 'success')
                            setCountDown(120)
                            setIsSend(true)
                            setLoading(false)
                          })
                          .catch(error => {
                            console.log(error)
                            setIsSend(false)
                          })
                      }
                    }}
                    disabled={isSend || loading}
                    size='small'
                  >
                    {countDown !== 0 ? `Wait ${countDown}s to resend` : 'Resend verify code'}
                  </Button>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12} sx={{ marginTop: 6 }}>
                <TextField
                  fullWidth
                  autoComplete='off'
                  label='New Password'
                  placeholder='New Password'
                  value={values.newPassword}
                  id='account-settings-new-password'
                  onChange={handleNewPasswordChange('newPassword')}
                  type={values.showNewPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowNewPassword}
                          aria-label='toggle password visibility'
                          onMouseDown={handleMouseDownNewPassword}
                        >
                          {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  error={error?.newPassword?.isError}
                  helperText={error?.newPassword?.error}
                />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: 6 }}>
                <TextField
                  fullWidth
                  autoComplete='off'
                  label='Confirm New Password'
                  placeholder='Confirm New Password'
                  value={values.confirmNewPassword}
                  id='account-settings-confirm-new-password'
                  type={values.showConfirmNewPassword ? 'text' : 'password'}
                  onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          aria-label='toggle password visibility'
                          onClick={handleClickShowConfirmNewPassword}
                          onMouseDown={handleMouseDownConfirmNewPassword}
                        >
                          {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  error={error?.confirmPassword?.isError}
                  helperText={error?.confirmPassword?.error}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 3 }}>
                <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleSubmit}>
                  Save Changes
                </Button>
                <Button
                  type='reset'
                  variant='outlined'
                  color='secondary'
                  onClick={() => {
                    setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '' })
                    setVerifyToken('')
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          sm={6}
          xs={12}
          sx={{ display: 'flex', marginTop: [7.5, 2.5], alignItems: 'center', justifyContent: 'center' }}
        >
          <img width={183} alt='avatar' height={256} src='/images/pages/pose-m-1.png' />
        </Grid>
      </Grid>
    </CardContent>
  )
}
export default TabSecurity

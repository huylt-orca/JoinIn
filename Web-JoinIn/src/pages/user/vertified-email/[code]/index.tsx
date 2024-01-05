import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Backdrop, CircularProgress, Typography, Grid } from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CheckCircleOutline } from 'mdi-material-ui'

const VerifyEmailPage = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const { code, utm_source } = router.query
  useEffect(() => {
    if (code?.length === 0) {
      router.push('/user/logout', '/user/login')
    } else {
      setTimeout(() => {
        setIsSuccess(true)
      }, 3000)

      setTimeout(() => {
        router.push({
          pathname: '/profile/initialization',
          query: {
            token: code as unknown as string,
            utm_source: utm_source as unknown as string
          }
        })
      }, 500)
    }
  }, [code])

  return (
    <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={true}>
      <Grid container direction={'column'} justifyContent={'center'} alignItems={'center'}>
        {!isSuccess ? (
          <>
            <Grid item>
              <CheckCircleOutline color='success' style={{ width: '70px', height: '70px' }} />
            </Grid>
            <Grid item>
              <Typography color={'white'} fontSize={20}>
                Verifying email...
              </Typography>
            </Grid>
          </>
        ) : (
          <>
            <Grid item>
              <CircularProgress color='success' style={{ width: '70px', height: '70px' }} />
            </Grid>
            <Grid item>
              <Typography color={'white'} fontSize={20}>
                Verify email successfully
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Backdrop>
  )
}

VerifyEmailPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default VerifyEmailPage

import { Box, Grid, Typography } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import TabAccount from 'src/views/profile/TabAccount'
import { useRouter } from 'next/router'

const InitializationProfilePage = () => {
  const router = useRouter()
  const [code, setCode] = useState<string>('')

  useEffect(() => {
    setCode(router.query?.token as string)
  }, [router.query])

  return (
    <Box>
      <Grid
        container
        width={'80%'}
        direction={'column'}
        alignContent='center'
        justifyContent={'center'}
        alignItems={'center'}
        style={{
          margin: 'auto'
        }}
      >
        <Grid item m={5} mt={10}>
          <Typography variant='h6'>Create your profile</Typography>
        </Grid>
        <Grid item>
          <TabAccount code={code} />
        </Grid>
      </Grid>
    </Box>
  )
}

InitializationProfilePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default InitializationProfilePage

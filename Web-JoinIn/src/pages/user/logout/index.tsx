import { useRouter } from 'next/router'
import * as React from 'react'
import { userDBDexie } from 'src/models/db/UserDB'
import { Backdrop, CircularProgress } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'

export default function LogoutPage() {
  const router = useRouter()
  const query = router.query
  const { status } = useSession()

  React.useEffect(() => {
    console.log(query)

    handleLogout()
  },[])

  const handleLogout = async () => {
    if(status === 'authenticated'){
      await signOut()
    }
    await userDBDexie.clearToken().then(() =>
      router.push(
        {
          pathname: '/user/login',
          query: {
            back: 1,
            ...query
          }
        },
        `/user/login?utm_source=${query.utm_source ?? ""}`
      )
    )
  }

  return (
    <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress color='inherit' title='Logout' />
    </Backdrop>
  )
}

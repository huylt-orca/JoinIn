// withAuth.tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { userDBDexie } from 'src/models/db/UserDB'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import jwt_decode from 'jwt-decode'
import { JWTModel } from 'src/models/common/JWTModel'
import { useToasts } from 'react-toast-notifications'
import { NextPage } from 'next'

const withAuth = (WrappedComponent: NextPage) => {
  const AuthComponent: NextPage = (props: any) => {
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const addToast = useToasts()

    const notify = () => {
      addToast.addToast('You are not able to access this page', { appearance: 'error' })
    }

    useEffect(() => {
      setIsLoading(true)
      checkLogin()
    }, [props])

    const checkLogin = async () => {
      await userDBDexie.getToken().then(value => {
        const pathName = router.pathname

        if (value?.length === 0) {
          router.push('/user/logout', '/user/login')
          notify()

          return
        }
        const tokenModel = new JWTModel(jwt_decode(value ?? ''))

        if (pathName.startsWith('/admin')) {
          if (tokenModel.role !== 'Admin') {
            router.push('/user/logout', '/user/login')
            notify()

            return
          }
        } else {
          if (tokenModel.role !== 'User') {
            router.push('/user/logout', '/user/login')
            notify()

            return
          }
        }

        setIsLoading(false)
      })
    }

    if (isLoading) {
      return (
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color='inherit' />
        </Backdrop>
      )
    }

    return <WrappedComponent {...props} />
  }
  AuthComponent.getLayout = WrappedComponent.getLayout

  return AuthComponent
}

export default withAuth

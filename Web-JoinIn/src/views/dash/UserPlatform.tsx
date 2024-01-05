// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Imports

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

interface DataType {
  title: string
  imgSrc: string
  amount: string
  subtitle: string
  progress: number
  color: ThemeColor
  imgHeight: number
}



const UserPlatform = (props: { totalUser: number; tiktokUser: number; facebookUser: number; unknowUser: number }) => {

  const data: DataType[] = [
    {
      progress: (props.facebookUser / props.totalUser) * 100 ,
      imgHeight: 20,
      title: 'Facebook',
      color: 'primary',
      amount: props.facebookUser.toString(),
      subtitle: '',
      imgSrc: '/images/cards/logo-facebook.png'

    },
    {
      progress: (props.tiktokUser / props.totalUser) * 100,
      color: 'info',
      imgHeight: 27,
      title: 'Tiktok',
      amount: props.tiktokUser.toString(),
      subtitle: '',
      imgSrc: '/images/cards/logo-tiktok.png'
    },
    {
      progress: (props.unknowUser / props.totalUser) * 100,
      imgHeight: 20,
      title: 'Other',
      color: 'secondary',
      amount: props.unknowUser.toString(),
      subtitle: '',
      imgSrc: '/images/cards/logo-aviato.png'
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Number of Registrations'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        subheader='The number of users registered through the social networking platform'
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' sx={{ fontWeight: 600, fontSize: '2.125rem !important' }}>
            {props.totalUser} Users
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>

            </Typography>
          </Box>
        </Box>



        {data.map((item: DataType, index: number) => {
          return (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(index !== data.length - 1 ? { mb: 5 } : {})
              }}
            >
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 40,
                  height: 40,
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.04)`
                }}
              >
                <img src={item.imgSrc} alt={item.title} height={item.imgHeight} />
              </Avatar>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                    {item.title}
                  </Typography>
                  <Typography variant='caption'>{item.subtitle}</Typography>
                </Box>

                <Box sx={{ minWidth: 85, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    {item.amount}
                  </Typography>
                  <LinearProgress color={item.color} value={item.progress} variant='determinate' />
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default UserPlatform

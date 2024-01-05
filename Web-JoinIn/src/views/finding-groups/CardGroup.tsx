// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Button, ButtonGroup } from '@mui/material'
import { useRouter } from 'next/router'
import { GroupCard } from 'src/models/views/GroupCard'
import { FC } from 'react'

interface GroupProps {
  groupCard: GroupCard
}

const CardGroup: FC<GroupProps> = ({ groupCard }) => {
  const router = useRouter()

  const handleClickOpen = async () => {
    //handle Click Open View Group
    // await saveGroupInfor()
    router.push('/view-group?group=' + groupCard.Id)
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardMedia sx={{ height: '12.625rem' }} image={groupCard.Theme} />
      <Avatar
        alt='Group Image'
        src={groupCard.Avatar}
        sx={{
          width: 75,
          height: 75,
          left: '1.313rem',
          top: '10.28125rem',
          position: 'absolute',
          border: theme => `0.25rem solid ${theme.palette.common.white}`
        }}
      />
      <CardContent>
        <Box
          sx={{
            mt: 5.75,
            mb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'start',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6'>{groupCard.Name}</Typography>
            <Typography variant='caption'>
              Subject: <b>{groupCard.SubjectName}</b>
            </Typography>
            <Typography variant='caption'>
              Class: <b>{groupCard.ClassName}</b>
            </Typography>
            <Typography variant='caption'>
              School: <b>{groupCard.SchoolName}</b>
            </Typography>
          </Box>
          <Button variant='contained' onClick={() => handleClickOpen()}>
            Open
          </Button>
        </Box>

        <ButtonGroup variant='text' aria-label='text button group' size='small'>
          <Typography variant='body1'>Recruit: </Typography>
          {groupCard.Major?.map(major => (
            <Button key={major.Id}>{major.ShortName}</Button>
          ))}
        </ButtonGroup>

        <Box
          sx={{
            mt: 3,
            gap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
            {groupCard.MemberCount} members
          </Typography>
          <AvatarGroup max={3} total={groupCard.MemberCount}>
            <Avatar src='/images/avatars/8.png' alt='Alice Cobb' />
            <Avatar src='/images/avatars/7.png' alt='Jeffery Warner' />
            <Avatar src='/images/avatars/3.png' alt='Howard Lloyd' />
            <Avatar src='/images/avatars/2.png' alt='Bettie Dunn' />
            <Avatar src='/images/avatars/4.png' alt='Olivia Sparks' />
            <Avatar src='/images/avatars/5.png' alt='Jimmy Hanson' />
            <Avatar src='/images/avatars/6.png' alt='Hallie Richards' />
            <Avatar src='/images/avatars/1.png' alt='Hallie Richards' />
          </AvatarGroup>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardGroup

import {
  Grid,
  Card,
  CardMedia,
  Avatar,
  CardContent,
  Box,
  Typography,
  Divider
} from '@mui/material'
import {
  AccountTieHat,
  Book,
  School,
  TownHall,
  AlphaACircleOutline,
  InformationVariant,
  AccountGroup
} from 'mdi-material-ui'
import { ReactNode } from 'react'
import { GroupMajor } from 'src/models/class'

const SpaceBetweenText = (props: { title: string; content: string }) => {
  return (
    <Box
      sx={{
        mt: 7,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontSize: '1rem' }}>{props.title}</Typography>
      </Box>
      <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
        {props.content}
      </Typography>
    </Box>
  )
}

export interface GruopDetailProps {
  actionGroup?: ReactNode
  invitation?: ReactNode
  values: any
  imgSrc: string
  imgBackground: string
  skills: string
  description: string
  listRecruiting: GroupMajor[]
}

export default function GroupDetail({
  actionGroup,
  invitation,
  values,
  imgSrc,
  imgBackground,
  skills,
  description,
  listRecruiting
}: GruopDetailProps) {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ position: 'relative', height: '21rem' }}>
          <CardMedia sx={{ height: '15rem' }} image={imgBackground} />
          <Avatar
            alt={values.schoolName}
            src={imgSrc}
            sx={{
              width: 150,
              height: 150,
              left: '1.313rem',
              top: '10.28125rem',
              position: 'absolute',
              border: theme => `0.25rem solid ${theme.palette.common.white}`
            }}
          />
          <CardContent>
            <Box
              sx={{
                mt: 15,
                mb: 5,
                left: '12rem',
                top: '12rem',
                position: 'absolute',
                width: '80%'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h5'>Group {values.groupName}</Typography>
                </Box>
                {actionGroup ? <Box sx={{ mr: 2, mb: 1, display: 'flex' }}>{actionGroup}</Box> : null}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      {invitation ? (
        <Grid item xs={12}>
          {invitation}
        </Grid>
      ) : null}
      <Grid item xs={12} sm={4} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ marginBottom: 3.5 }}>
              Group Information
            </Typography>
            <Divider sx={{ marginY: '20px' }} />
            <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
              <TownHall sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
              <Typography variant='body1'>School: {values.schoolName}</Typography>
            </Box>
            <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
              <School sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
              <Typography variant='body1'>Class: {values.className}</Typography>
            </Box>
            <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
              <Book sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
              <Typography variant='body1'>Subject: {values.subject}</Typography>
            </Box>
            <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
              <AccountGroup sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
              <Typography variant='body1'>Group: {values.groupName}</Typography>
            </Box>
            <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
              <AccountTieHat sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
              <Typography variant='body1'>Leader: {values.leader}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mt: 6 }}>
          <CardContent>
            <Typography variant='h6' sx={{ marginBottom: 3.5 }}>
              Recruitment
            </Typography>
            <Divider sx={{ marginY: '20px' }} />
            <SpaceBetweenText title='Major' content='Quantity' />
            <Divider sx={{ marginX: '20px' }} />
            {listRecruiting.map(recruiting => (
              <SpaceBetweenText
                title={recruiting.major?.name ?? ''}
                content={recruiting.memberCount?.toString() ?? '0'}
                key={recruiting.majorId}
              />
            ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={8} md={8}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ marginBottom: 3.5 }}>
              Other Information
            </Typography>
            <Divider sx={{ marginY: '20px' }} />
            <Box sx={{ margin: 2, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <AlphaACircleOutline sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>Skills</Typography>
              </Box>

              <Typography variant='body1'>
                <div className='editor' dangerouslySetInnerHTML={{ __html: skills }} />
              </Typography>
            </Box>
            <Divider sx={{ marginY: '20px' }} />
            <Box sx={{ margin: 2, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <InformationVariant sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>Description</Typography>
              </Box>
              <Typography variant='body1'>
                <div className='editor' dangerouslySetInnerHTML={{ __html: description }} />
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      
    </Grid>
  )
}

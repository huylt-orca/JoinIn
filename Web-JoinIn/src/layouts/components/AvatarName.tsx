import { Avatar, Box, Typography } from '@mui/material'
import React, { ReactNode } from 'react'

interface AvatarNameProps {
  avatar: string
  title: string | ReactNode
  alt?: string
}

const AvatarName: React.FC<AvatarNameProps> = props => {
  const { alt = 'Avatar' } = props

  return (
    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
      <Avatar alt={alt} src={props.avatar} sx={{ width: 34, height: 34, marginRight: 2.75 }} />
      <Typography variant='body2'>{props.title}</Typography>
    </Box>
  )
}

export default AvatarName

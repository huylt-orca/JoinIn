// ** MUI Imports
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRouter } from 'next/router'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const router = useRouter()

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Button onClick={() => router.back()}>Back</Button>
      {hidden ? null : (
        
        // <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
        //   <Link
        //     target='_blank'
        //     href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/blob/main/LICENSE'
        //   >
        //     MIT License
        //   </Link>
        //   <Link target='_blank' href='https://themeselection.com/'>
        //     More Themes
        //   </Link>
        //   <Link
        //     target='_blank'
        //     href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/blob/main/README.md'
        //   >
        //     Documentation
        //   </Link>
        //   <Link
        //     target='_blank'
        //     href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/issues'
        //   >
        //     Support
        //   </Link>
        // </Box>

        <Typography sx={{ mr: 2 }}>
          {`© ${new Date().getFullYear()}, Made with `}
          <Box component='span' sx={{ color: 'error.main' }}>
            ❤️
          </Box>
          {` by `}
          <Link target='_blank' href='https://themeselection.com/'>
            JoinIn team
          </Link>
        </Typography>
      )}
    </Box>
  )
}

export default FooterContent

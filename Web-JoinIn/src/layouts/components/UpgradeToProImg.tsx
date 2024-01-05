import { Box } from '@mui/material'
import Link from 'next/link'
import { useSettings } from 'src/@core/hooks/useSettings'

const UpgradeToProImg = () => {
  const { settings } = useSettings()

  return (
    <Box sx={{ mx: 'auto' }}>
      <Link target='_blank' rel='noreferrer' href='/package-screen'>
        <img width={230} alt='upgrade to premium' src={`/images/misc/upgrade-banner-${settings.mode}.png`} />
      </Link>
    </Box>
  )
}

export default UpgradeToProImg

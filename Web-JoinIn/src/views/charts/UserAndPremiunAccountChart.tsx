import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

interface UserAndPremiunAccountChartProps {
  listUserCount: number[]
  listTransactionCount: number[]
}

export default function UserAndPremiunAccountChart({
  listUserCount,
  listTransactionCount
}: UserAndPremiunAccountChartProps) {
  const options: ApexOptions = {
    series: [
      {
        name: 'User',
        data: listUserCount,
        type: 'column'
      },
      {
        name: 'User with Premium',
        data: listTransactionCount,
        type: 'line'
      }
    ],
    chart: {
      height: 350
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '20%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    fill: {
      type: 'solid',
      opacity: [0.35, 1]
    },
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    markers: {
      size: 0
    },
    yaxis: [
      {
        title: {
          text: 'User'
        },
        labels: {
          offsetX: -17,
          formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}k` : value}`
        }
      },
      {
        opposite: true,
        title: {
          text: 'User with Premium'
        },
        labels: {
          offsetX: -17,
          formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}k` : value}`
        }
      }
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return y.toFixed(0) + ' user(s)'
          }

          return y
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Weekly Overview'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts height={300} options={options} series={options.series} />
        {/* <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ mr: 4 }}>
            45%
          </Typography>
          <Typography variant='body2'>Your sales performance is 45% 😎 better compared to last month</Typography>
        </Box> */}
      </CardContent>
    </Card>
  )
}

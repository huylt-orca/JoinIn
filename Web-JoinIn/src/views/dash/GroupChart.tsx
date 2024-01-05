// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'


// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const GroupChart = (props: { listDataGroup: number[]}) => {
  // ** Hook
  const theme = useTheme()
  const totalGroup = props.listDataGroup.reduce((total, num) => total + num, 0);

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: {  position: 'top',
    labels: {
      colors: ['#FF4560', '#008FFB'], // Màu cho các ghi chú tương ứng
    },
  },
    grid: {
      strokeDashArray: 5,
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.primary.main,
      theme.palette.error.main,
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['1-2', '3-6', '7-10', '11-20'],
      tickPlacement: 'on',
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetX: -17,
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title={'Group Statistics (Total group: ' + totalGroup + ')'}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts
          type='bar'
          height={205}
          options={options}
          series={[
            {
               name: "Group Count",
               data: props.listDataGroup,
            }
          ]}
        />
      </CardContent>
    </Card>
  )
}

export default GroupChart

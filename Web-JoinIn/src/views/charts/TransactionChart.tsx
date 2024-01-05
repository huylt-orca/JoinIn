import Box from '@mui/material/Box'
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
import { useEffect, useState } from 'react'
import { userAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { DashboardPerMonthModel } from 'src/models/class/DashboardPerMonthModel'

export default function TransactionChartView() {
  const [options, setOptions] = useState<ApexOptions | any>({})

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    await userAPI.Admin.getDashboard().then(dashboard => {
      const newData = new CommonResponse(dashboard).data as DashboardPerMonthModel[]

      const newListTransactionCount: number[] = []
      newData?.map(item => {
        newListTransactionCount.push(item.transactionCount)
      })

      const newOptions = {
        series: [
          {
            name: 'Transactions',
            data: newListTransactionCount,
            type: 'column'
          }
        ],
        chart: {
          height: 350
        },
        dataLabels: {
          enabled: true
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
              text: 'Transactions'
            },
            labels: {
              offsetX: -17,
              formatter: (value: any) => `${value > 999 ? `${(value / 1000).toFixed(0)}k` : `${value}`}`
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
            formatter: function (y: any) {
              if (typeof y !== 'undefined') {
                return y.toFixed(0)
              }

              return y
            }
          }
        }
      }

      setOptions(newOptions)
    })
  }

  return (
    <Card>
      <CardHeader
        title='Monthly Overview'
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
        {options?.series ? <ReactApexcharts height={300} options={options} series={options.series} /> : 'Loading....'}

        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          {/* <Typography variant='h5' sx={{ mr: 4 }}>
            45%
          </Typography> */}

          {/* <Typography variant='body2'>Your sales performance is 45% 😎 better compared to last month</Typography> */}
        </Box>
      </CardContent>
    </Card>
  )
}

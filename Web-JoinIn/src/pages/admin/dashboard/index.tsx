// ** MUI Imports
import Grid from '@mui/material/Grid'


// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import UserCard from 'src/views/dash/UserCard'
import RevenueOverview from 'src/views/dash/RevenueOverview'
import RevenueTrophy from 'src/views/dash/RevenueTrophy'
import UserOverview from 'src/views/dash/UserOverview'
import withAuth from 'src/pages/withAuth'
import { useEffect, useState } from 'react'
import { DashboardType } from 'src/models/class'
import { userAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { Backdrop, CircularProgress } from '@mui/material'
import GroupChart from 'src/views/dash/GroupChart'
import UserPlatform from 'src/views/dash/UserPlatform'

const Dashboard = () => {
  const [dataDashboard, setDataDashboard] = useState<DashboardType>();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() =>{
    setIsLoading(true);
    userAPI.Admin.getDashboard()
    .then(res =>{
      const data = new CommonResponse(res)
      setDataDashboard(data.data)
      setIsLoading(false);
    })
    .catch(err =>{
      console.log(err)
    })
  },[])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <RevenueTrophy revenue={dataDashboard?.totalRevenue ?? 0} />
        </Grid>
        <Grid item xs={12} md={8}>
          <UserCard freeUser={dataDashboard?.totalFreemiumUser ?? 0} growthRate={dataDashboard?.totalUserGrownPercentLastWeek ?? 0}
          preUser={dataDashboard?.totalPremiumUser ?? 0} totalUser={dataDashboard?.totalUser ?? 0}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <UserPlatform  totalUser={dataDashboard?.totalUser ?? 0}
          facebookUser={dataDashboard?.facebookUser ?? 0}
          tiktokUser={dataDashboard?.tiktokUser ?? 0}
          unknowUser={dataDashboard?.unknownUser ?? 0}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <GroupChart listDataGroup={dataDashboard?.groupCount ?? [0,0,0,0]}/>
        </Grid>
        <Grid item xs={12} md={12}>
          <RevenueOverview listFreeUser={dataDashboard?.freeUserCount ?? [0,0,0,0,0,0,0]} listPreUser={dataDashboard?.preUserCount ?? [0,0,0,0,0,0,0]} />
        </Grid>
        <Grid item xs={12} md={12} >
          <UserOverview listActivity={dataDashboard?.activeUserCount ??  [0,0,0,0,0,0,0]}/>
        </Grid>

      </Grid>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </ApexChartWrapper>
  )
}

export default withAuth(Dashboard)

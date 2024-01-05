import { Grid } from "@mui/material"
import FreemiumPackage from "src/views/package-screen/FreemiumPackage"
import PremiumPackage from "src/views/package-screen/PremiumPackage"
import withAuth from "../withAuth"

const PackageScreen = () =>{
  return (
    <Grid container spacing={15} display='flex' justifyContent='center' >
      <Grid item xs={12} sm={5} >
        <FreemiumPackage/>
      </Grid>
      <Grid item xs={12} sm={5} >
        <PremiumPackage/>
      </Grid>
    </Grid>
  )
}

export default withAuth(PackageScreen)

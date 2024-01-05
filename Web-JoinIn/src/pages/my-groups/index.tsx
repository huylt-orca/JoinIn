import HomeView from 'src/views/home/HomeView'
import withAuth from '../withAuth'

const MyGroups = () => {
  return <HomeView />
}


export default withAuth(MyGroups)

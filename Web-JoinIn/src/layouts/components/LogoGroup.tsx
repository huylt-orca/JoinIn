import { useEffect, useState } from 'react';
import { Chip, Avatar } from '@mui/material'
import { groupDBDexie } from 'src/models/db/GroupDB';

const useIndexedDBData = () => {
    const [group, setGroup] = useState<any>()

  // Implement logic to fetch data from IndexDB
  useEffect(() => {
    createLogoGroup()
  }, [])

  const createLogoGroup = async () => {
    const newGroup = await groupDBDexie.getGroup()
    setGroup(newGroup)
  }

  return group
}

export default function LogoGroup () {
    const group= useIndexedDBData()

  return (
    <Chip
      avatar={<Avatar src={group ? group.avatar : ''} alt={group ? group.name : ''}></Avatar>}
      label={group ? group.name : ''}
    ></Chip>
  )
}

// ** React Imports
import { useState, ChangeEvent, useEffect, KeyboardEvent } from 'react'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { Autocomplete, Box, Button, Card, Grid, InputAdornment, Pagination, TextField, Typography } from '@mui/material'
import CardGroup from 'src/views/finding-groups/CardGroup'
import { Magnify } from 'mdi-material-ui'
import withAuth from '../withAuth'
import { QueryGroupListModel } from 'src/models/query-models/QueryGroupListModel'
import { groupAPI, majorAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { useToasts } from 'react-toast-notifications'
import { Group, Major } from 'src/models/class'
import { GroupCard } from 'src/models/views/GroupCard'
import { MajorGroupCard } from 'src/models/views/MajorGroupCard'

const FindingGroupsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [totalItems, setTotalItems] = useState<number>(0)
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const [listGroup, setlistGroup] = useState<GroupCard[]>([])
  const [searchName, setSearchName] = useState<string>('')
  const [storeSearchName, setStoreSearchName] = useState<string>('')
  const [listMajors, setListMajors] = useState<Major[]>([])
  const [selectedValues, setSelectedValues] = useState<Major[]>([])
  const addToast = useToasts()
  const [updateUI, setUpdateUI] = useState<boolean>(true)

  useEffect(() => {
    getListMajors()
    getListGroup()
  }, [storeSearchName, currentPage, updateUI])

  const getListMajors = async () => {
    try {
      await majorAPI
        .getList()
        .then(res => {
          const data = new CommonResponse(res)
          const majors: Major[] = data.data
          setListMajors(majors)
        })
        .catch(error => {
          console.log(error)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const getListGroup = async () => {
    try {
      const payload: QueryGroupListModel = {
        name: storeSearchName,
        majorIdsString: selectedValues.map(value => value.id).join(','),
        orderBy: '',
        page: currentPage,
        pageSize: itemsPerPage,
        type: '',
        value: ''
      }

      await groupAPI
        .getListFindingGroup(payload)
        .then(res => {
          const data = new CommonResponse(res)
          addToast.addToast(data.message, { appearance: 'success' })
          const totalItems: number = data.pagination?.total ?? 0
          setTotalItems(totalItems)

          const groups: Group[] = data.data
          const list: GroupCard[] = []
          groups.map(group => {
            const majors: MajorGroupCard[] = []
            group.groupMajors?.map(major => {
              majors.push({
                Id: major.majorId,
                Quantity: major.memberCount,
                Name: major.major?.name,
                ShortName: major.major?.shortName
              } as MajorGroupCard)
            })

            list.push({
              Id: group.id,
              Name: group.name,
              SchoolName: group.schoolName,
              ClassName: group.className,
              SubjectName: group.subjectName,
              MemberCount: group.memberCount,
              Major: majors,
              Avatar: group.avatar ?? '',
              Theme: group.theme ?? ''
            })
          })
          setlistGroup(list)
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleClickSearch = () => {
    setStoreSearchName(searchName)
    setUpdateUI(!updateUI)
  }

  const handleEnterSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log(event.currentTarget.value)
      setStoreSearchName(searchName)
    }
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value)
  }

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)

    // router.push(
    //   {
    //     pathname: `/finding-groups`,
    //     query: {
    //       page
    //     }
    //   },
    //   `/finding-groups?page=${page}`,
    //   { shallow: true }
    // )
  }

  return (
    <Card sx={{ padding: '15px' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <TextField
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 }, padding: '15px' }}
          onChange={handleSearch}
          onKeyDown={handleEnterSearch}
          placeholder='Search by group, school,..'
          value={searchName}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' onClick={handleClickSearch} />
              </InputAdornment>
            )
          }}
        />
        <Autocomplete
          sx={{ padding: '15px', width: '30%' }}
          size='small'
          multiple
          options={listMajors}
          getOptionLabel={option => option.name ?? ''}
          onChange={(event, value) => setSelectedValues(value)}
          renderInput={params => <TextField {...params} label='Select Major' variant='outlined' />}
          renderOption={(props, option) => (
            <li {...props}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography fontSize={17} fontWeight={600}>
                  {option.name}
                </Typography>
              </div>
            </li>
          )}
        />
        <Button variant='contained' onClick={handleClickSearch}>
          <Magnify fontSize='small' />
        </Button>
      </Box>

      <Grid container spacing={7}>
        {listGroup.map(index => (
          <Grid item xs={12} sm={6} md={4} key={index.Id}>
            <CardGroup groupCard={index} />
          </Grid>
        ))}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color='primary' />
        </Grid>
      </Grid>
    </Card>
  )
}

export default withAuth(FindingGroupsPage)

import { ChangeEvent, useEffect, useState } from 'react'
import { groupAPI } from 'src/api-client/group'
import { Group } from 'src/models/class'
import {
  CardHeader,
  Box,
  Card,
  Grid,
  TextField,
  FormControl,
  Button,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Switch,
  Avatar,
  Checkbox,
  Typography
} from '@mui/material'
import { Column } from 'src/models/common/Column'
import withAuth from 'src/pages/withAuth'

const columns: Column[] = [
  {
    id: 'name',
    label: 'Name',
    align: 'left'
  },
  {
    id: 'avatar',
    label: 'Avatar',
    align: 'left',
    format: (value: Group) => <Avatar alt='Test' src={value?.avatar} sizes='small' />
  },
  {
    id: 'createdDate',
    label: 'Created date',
    align: 'left'
  },
  {
    id: 'groupSize',
    label: 'Member',
    align: 'left',
    format: (value: Group) => (
      <Typography>
        {value.memberCount}/{value.groupSize}
      </Typography>
    )
  },
  {
    id: 'schoolName',
    label: 'School',
    align: 'left'
  },
  {
    id: 'className',
    label: 'Class',
    align: 'left'
  },
  {
    id: 'subjectName',
    label: 'Subject',
    align: 'left'
  },
  {
    id: 'status',
    label: 'Status',
    align: 'left',
    format: (value: string) => {
      return value === 'ACTIVE' ? <Switch checked /> : <Switch checked={false} />
    }
  }
]

const GroupManagePage = () => {
  const [groupList, setGroupList] = useState<Group[]>(groupAPI.Admin.getListGroup())
  const [searchValue, setSearchValue] = useState<string>('')
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [rowsSelected, setRowsSelected] = useState<number[]>([])
  const [currentData, setCurrentData] = useState<Group[]>()

  useEffect(() => {
    setCurrentData(groupList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))
  }, [searchValue, page, rowsPerPage])

  // const handleCheckRowIndex = (event: any, id: number) => {
  //   const selectedRows = [...rowsSelected]
  //   if (event.target.checked) {
  //     selectedRows.push(id)
  //   } else {
  //     selectedRows.splice(rowsSelected.indexOf(id), 1)
  //   }

  //   setRowsSelected(selectedRows)
  // }

  const handleCheckAllRow = (event: any) => {
    if (event.target.checked) {
      // setRowsSelected(currentData?.map(value => value.id ?? -1) ?? [])
    } else {
      setRowsSelected([])
    }
  }

  const changeSearchValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchValue(event?.target.value)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setRowsSelected([])
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
    setRowsSelected([])
    setGroupList(groupAPI.Admin.getListGroup())
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box>
            <Grid container spacing={1} justifyContent={'space-around'}>
              <Grid item sm={5} md={4}>
                <FormControl fullWidth>
                  <TextField
                    id='form-input-search-value'
                    placeholder='Search'
                    label={'Search'}
                    value={searchValue}
                    onChange={e => changeSearchValue(e)}
                    size='small'
                  />
                </FormControl>
              </Grid>
              <Grid item container sm={7} md={8} spacing={0.5} justifyContent={'flex-end'}>
                <Grid item>
                  <Button size='small' variant='outlined' color='error' sx={{ m: 1 }}>
                    Ban
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        }
      />
      <CardContent>
        <TableContainer sx={{ height: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell align='center' padding='none'>
                  <Checkbox onChange={handleCheckAllRow} checked={rowsSelected.length === rowsPerPage} />
                </TableCell>
                <TableCell align='center' sx={{ minWidth: '30px' }}>
                  Index
                </TableCell>
                {columns?.map(column => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData?.map((row, index) => {
                const rowData: any = row

                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={rowData?.Id}>
                    <TableCell align='center' padding='none'>
                      <Checkbox

                      // onChange={e => handleCheckRowIndex(e, row.id ?? -1)}
                      // checked={rowsSelected.indexOf(row.id ?? -1) !== -1}
                      />
                    </TableCell>
                    <TableCell align='center'>{page * rowsPerPage + index + 1}</TableCell>
                    {columns.map(column => {
                      const value = rowData[column.id]

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(row) : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={groupList?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  )
}

export default withAuth(GroupManagePage)

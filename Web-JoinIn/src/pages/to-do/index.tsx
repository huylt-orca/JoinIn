import ToDoTableCollapsible from 'src/views/tables/TableCollapsibleCutom'
import withAuth from '../withAuth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { QueryTaskListsModel } from 'src/models/query-models/QueryTaskListsModel'
import { Box, Grid, TextField } from '@mui/material'
import { CommonResponse } from 'src/models/common/CommonResponse'
import { taskAPI } from 'src/api-client'
import { Task } from 'src/models/class'
import { AxiosError } from 'axios'

const ToDoPage = () => {
  const router = useRouter()
  const [queryModel, setQueryModel] = useState<QueryTaskListsModel>(
    new QueryTaskListsModel({
      name: router.query.name ?? '',
      groupId: router.query.groupId ?? '',
      pageSize: router.query.pageSize ?? 10,
      page: router.query.page ?? 1,
      orderBy: router.query.orderBy ?? '',
      value: router.query.value ?? '',
      total: router.query.total ?? 0
    } as QueryTaskListsModel)
  )
  const [taskList, setTaskList] = useState<Task[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getListTask(queryModel)
  }, [])

  const getListTask = async (query?: QueryTaskListsModel) => {
    try {
      await taskAPI
        .getList(query)
        .then(res => {
          const data = new CommonResponse(res)
          const newTaskList: Task[] = data.data
          const query = new QueryTaskListsModel({
            ...queryModel,
            total: data.pagination?.total,
            page: data.pagination?.currentPage ?? 1,
            pageSize: data.pagination?.pageSize ?? 10
          } as QueryTaskListsModel)
          setQueryModel(query)
          setTaskList(newTaskList)
          setTimeout(() => {
            setIsLoading(false)
          }, 300)
        })
        .catch(error => {
          if ((error as AxiosError)?.response?.status === 401) {
            router.push('/user/logout', '/user/login')
          } else {
            console.log(error)
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  const changeQuery = (value: QueryTaskListsModel) => {
    setQueryModel(new QueryTaskListsModel(value))
    setIsLoading(true)
    router.push(
      {
        pathname: '/to-do',
        query: {
          ...value
        }
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              value={queryModel.name}
              label='Task name'
              placeholder='Task name'
              onChange={e => {
                const query = new QueryTaskListsModel(queryModel)
                query.name = e.target.value
                setQueryModel(query)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  changeQuery(queryModel)
                }
              }}
              size='small'
            />
          </Grid>
        </Grid>
      </Box>
      <ToDoTableCollapsible
        queryModel={queryModel}
        changeQuery={changeQuery}
        taskList={taskList ?? []}
        isLoading={isLoading}
      ></ToDoTableCollapsible>
    </>
  )
}

export default withAuth(ToDoPage)

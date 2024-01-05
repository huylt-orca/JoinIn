import { useEffect, useState } from 'react'
import { Comment } from 'src/models/class'
import { Box, Stepper, Step, StepLabel, StepContent, Paper, Grid, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { CalendarBlank } from 'mdi-material-ui'
import { StepIconProps } from '@mui/material/StepIcon'

export interface ITaskCommentViewProps {
  data: Comment[]
}

export const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  color: theme.palette.text.secondary,
  height: 'auto',
  width: 'auto',
  padding: '10px',
  paddingLeft: '10px',
  fontWeight: 500,
  marginBottom: '4px',
  marginTop: '4px',
  wordBreak: 'break-word'
}))

interface CommentMapper {
  [key: string]: Comment[]
}

export default function TaskCommentView({ data }: ITaskCommentViewProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [listCommentMap, setListCommentMap] = useState<string[]>([])
  const [commentMap, setCommentMap] = useState<CommentMapper>({})
  const [limit, setLimit] = useState<number>(1)

  useEffect(() => {
    processData(data)
  }, [data])

  function Icon(props: StepIconProps) {
    const { active } = props

    if (active) {
      return <CalendarBlank color='info' />
    }

    return <CalendarBlank />
  }

  const processData = (value: Comment[]) => {
    let result: CommentMapper
    const list: string[] = []

    if (value.length === 0) return

    let currentDate = value[0].createdDate
    result = { ...result!, [moment(value[0].createdDate).format('yyyy-MM-DD')]: [value[0]] }
    list.push(moment(value[0].createdDate).format('yyyy-MM-DD'))
    for (let index = 1; index < value.length; index++) {
      const val = value[index]
      if (moment(val.createdDate).isSame(currentDate, 'day')) {
        result = {
          ...result,
          [moment(val.createdDate).format('yyyy-MM-DD')]: [...result[moment(val.createdDate).format('yyyy-MM-DD')], val]
        }
      } else {
        result = { ...result, [moment(val.createdDate).format('yyyy-MM-DD')]: [val] }
        list.push(moment(val.createdDate).format('yyyy-MM-DD'))
        currentDate = val.createdDate
      }
    }
    setListCommentMap(list.reverse())
    setCommentMap(result)
  }

  const handleViewMore = () => {
    setLimit(limit + 3)
  }

  const handleViewLess = () => {
    const tmp = limit - 3
    if (tmp < 3) {
      setLimit(1)
      setActiveStep(0)
    } else {
      setLimit(tmp)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mb: 5, ml: 5 }}>
      <Stepper activeStep={activeStep} orientation='vertical'>
        {listCommentMap?.slice(0, limit).map((date, index) => (
          <Step key={index} onClick={() => setActiveStep(index)}>
            <StepLabel StepIconComponent={Icon}>{date}</StepLabel>
            <StepContent>
              {commentMap[date]?.map((val, index) => {
                return <Item key={index} elevation={3} dangerouslySetInnerHTML={{ __html: val.content! }}></Item>
              })}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      <Grid container justifyContent={'center'} spacing={2}>
        <Grid item>
          <Button size='small' color='info' onClick={handleViewLess} disabled={limit <= 3}>
            View less
          </Button>
        </Grid>
        <Grid item>
          <Button size='small' color='info' onClick={handleViewMore} disabled={limit >= listCommentMap.length}>
            View older
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

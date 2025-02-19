import { Card, CardContent, Typography } from "@mui/material"
import dayjs from 'dayjs'

interface ChatCountProps {
  selectedDate: dayjs.Dayjs
}

export function ChatCount({ selectedDate }: ChatCountProps) {
  const isYesterday = selectedDate.isSame(dayjs().subtract(1, 'day'), 'day')

  return (
    <Card className="stats-card">
      <CardContent className="stats-card-content">
        <Typography variant="h6" gutterBottom>
          {isYesterday ? '전일' : selectedDate.format('MM/DD')} 대화 개수
        </Typography>
        <Typography variant="h4">5,678</Typography>
        <Typography variant="body2" color="text.secondary">
          이전 영업일 대비 +8%
        </Typography>
      </CardContent>
    </Card>
  )
} 
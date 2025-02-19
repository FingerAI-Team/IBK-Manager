import { Card, CardContent, Typography } from "@mui/material"
import dayjs, { Dayjs } from 'dayjs'

interface UserCountProps {
  selectedDate: Dayjs
}

export function UserCount({ selectedDate }: UserCountProps) {
  const isYesterday = selectedDate.isSame(dayjs().subtract(1, 'day'), 'day')

  return (
    <Card className="stats-card">
      <CardContent className="stats-card-content">
        <Typography variant="h6" gutterBottom>
          {isYesterday ? '전일' : selectedDate.format('MM/DD')} 사용자 수
        </Typography>
        <Typography variant="h4">1,234</Typography>
        <Typography variant="body2" color="text.secondary">
          이전 영업일 대비 +15%
        </Typography>
      </CardContent>
    </Card>
  )
} 
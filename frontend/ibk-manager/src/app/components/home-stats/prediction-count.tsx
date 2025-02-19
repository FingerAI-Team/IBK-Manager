import { Card, CardContent, Typography } from "@mui/material"
import dayjs, { Dayjs } from 'dayjs'

interface PredictionCountProps {
  selectedDate: Dayjs
}

export function PredictionCount({ selectedDate }: PredictionCountProps) {
  const isYesterday = selectedDate.isSame(dayjs().subtract(1, 'day'), 'day')

  return (
    <Card className="stats-card">
      <CardContent className="stats-card-content">
        <Typography variant="h6" gutterBottom>
          {isYesterday ? '전일' : selectedDate.format('MM/DD')} 예측 결과
        </Typography>
        <div className="prediction-results">
          <div className="prediction-item">
            <Typography variant="h4" color="#2E7D32">789</Typography>
            <Typography variant="body2" color="text.secondary">
              O인 답변 수
            </Typography>
          </div>
          <div className="prediction-item">
            <Typography variant="h4" color="#D32F2F">123</Typography>
            <Typography variant="body2" color="text.secondary">
              X인 답변 수
            </Typography>
          </div>
        </div>
        <Typography variant="body2" color="text.secondary" className="accuracy-text">
          정확도: 86.5%
        </Typography>
      </CardContent>
    </Card>
  )
} 
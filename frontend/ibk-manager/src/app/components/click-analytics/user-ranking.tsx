import { Card, CardContent, Typography } from "@mui/material"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

const userRankData = [
  { userId: "user_5", clicks: -150, chats: 200 },
  { userId: "user_3", clicks: -130, chats: 160 },
  { userId: "user_8", clicks: -110, chats: 130 },
  { userId: "user_2", clicks: -80, chats: 110 },
  { userId: "user_9", clicks: -70, chats: 80 },
  { userId: "user_1", clicks: -60, chats: 60 },
  { userId: "user_6", clicks: -50, chats: 50 },
  { userId: "user_4", clicks: -40, chats: 40 },
  { userId: "user_7", clicks: -30, chats: 30 },
  { userId: "user_10", clicks: -20, chats: 20 },
]

const COLORS = {
  clicks: 'var(--ibk-blue)',
  chats: 'var(--success-green)'
}

export function UserRanking() {
  const formatTooltipValue = (value: ValueType, name: string) => {
    if (typeof value === 'number') {
      const label = name === "chats" ? "대화 수" : "클릭 수"
      return [Math.abs(value), label]
    }
    return [0, ""]
  }

  return (
    <Card>
      <CardContent>
        <div className="date-selector-area">
          <Typography variant="h6">📌 사용자 클릭 & 대화 횟수 비교 (TOP 10)</Typography>
          <div className="date-picker-group">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="시작일" className="MuiDatePicker-root" />
              <DatePicker label="종료일" className="MuiDatePicker-root" />
            </LocalizationProvider>
          </div>
        </div>
        <div className="legend-area">
          <span className="legend-item legend-item-clicks">🔻 클릭 횟수 (←)</span>
          <span className="legend-item">사용자 ID</span>
          <span className="legend-item legend-item-chats">대화 횟수 (→) 🔻</span>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={userRankData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[-200, 200]}
                tickFormatter={(value) => Math.abs(value).toString()}
              />
              <YAxis dataKey="userId" type="category" />
              <Tooltip formatter={formatTooltipValue} />
              <Bar
                dataKey="clicks"
                fill={COLORS.clicks}
                name="clicks"
              />
              <Bar
                dataKey="chats"
                fill={COLORS.chats}
                name="chats"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 
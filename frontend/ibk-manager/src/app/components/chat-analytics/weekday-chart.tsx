import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useState } from 'react'

const weekdayData = [
  { day: "월", chats: 1200, users: 800 },
  { day: "화", chats: 1500, users: 900 },
  { day: "수", chats: 1800, users: 1100 },
  { day: "목", chats: 2200, users: 1300 },
  { day: "금", chats: 2500, users: 1500 },
  { day: "토", chats: 1800, users: 1000 },
  { day: "일", chats: 1200, users: 700 },
]

const COLORS = {
  chats: 'var(--ibk-blue)',
  users: 'var(--success-green)'
}

export function WeekdayChart() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  return (
    <Card>
      <CardContent>
        <div className="chart-header">
          <Typography variant="h6">요일별 대화/사용자 수</Typography>
          <FormControl className="form-control">
            <InputLabel>월 선택</InputLabel>
            <Select 
              label="월 선택" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}월</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekdayData} className="chart">
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}${value === weekdayData[0].users ? '명' : '회'}`, 
                  value === weekdayData[0].users ? "사용자 수" : "대화 수"]}
                wrapperClassName="chart-tooltip"
              />
              <Bar dataKey="chats" fill={COLORS.chats} name="대화 수" />
              <Bar dataKey="users" fill={COLORS.users} name="사용자 수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 
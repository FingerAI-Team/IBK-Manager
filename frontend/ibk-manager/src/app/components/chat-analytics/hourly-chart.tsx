import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react'

const hourlyData = [
  { hour: "00", chats: 50 },
  { hour: "01", chats: 30 },
  { hour: "02", chats: 20 },
  { hour: "03", chats: 10 },
  { hour: "04", chats: 5 },
  { hour: "05", chats: 15 },
  { hour: "06", chats: 25 },
  { hour: "07", chats: 45 },
  { hour: "08", chats: 80 },
  { hour: "09", chats: 120 },
  { hour: "10", chats: 150 },
  { hour: "11", chats: 180 },
  { hour: "12", chats: 200 },
  { hour: "13", chats: 190 },
  { hour: "14", chats: 170 },
  { hour: "15", chats: 160 },
  { hour: "16", chats: 140 },
  { hour: "17", chats: 130 },
  { hour: "18", chats: 100 },
  { hour: "19", chats: 90 },
  { hour: "20", chats: 70 },
  { hour: "21", chats: 60 },
  { hour: "22", chats: 40 },
  { hour: "23", chats: 35 }
]

export function HourlyChart() {
  const [dateType, setDateType] = useState('today')
  const [showDatePickers, setShowDatePickers] = useState(false)

  const handleDateTypeChange = (value: string) => {
    setDateType(value)
    setShowDatePickers(value === 'custom')
  }

  return (
    <Card>
      <CardContent>
        <div className="chart-header">
          <Typography variant="h6">시간대별 대화량</Typography>
          <div className="chart-controls">
            {showDatePickers && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="date-picker-group">
                  <DatePicker label="시작일" />
                  <DatePicker label="종료일" />
                </div>
              </LocalizationProvider>
            )}
            <FormControl className="form-control">
              <InputLabel>기간</InputLabel>
              <Select 
                label="기간" 
                value={dateType}
                onChange={(e) => handleDateTypeChange(e.target.value)}
              >
                <MenuItem value="today">오늘</MenuItem>
                <MenuItem value="yesterday">어제</MenuItem>
                <MenuItem value="thisWeek">이번주</MenuItem>
                <MenuItem value="thisMonth">한달</MenuItem>
                <MenuItem value="custom">기간 지정</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} className="chart">
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}회`, "대화 수"]}
                wrapperClassName="chart-tooltip"
              />
              <Bar dataKey="chats" fill="var(--ibk-blue)" name="대화 수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useState } from 'react'

const userChatData = [
  { userId: "User 1", chats: 150 },
  { userId: "User 2", chats: 120 },
  { userId: "User 3", chats: 100 },
  { userId: "User 4", chats: 90 },
  { userId: "User 5", chats: 80 },
  { userId: "User 6", chats: 70 },
  { userId: "User 7", chats: 60 },
  { userId: "User 8", chats: 50 },
  { userId: "User 9", chats: 40 },
  { userId: "User 10", chats: 30 },
  // ... 더 많은 데이터 추가 가능
]

export function UserRanking() {
  const [period, setPeriod] = useState('daily')
  const [displayCount, setDisplayCount] = useState(10)
  const [sortOrder, setSortOrder] = useState('desc')

  const sortedData = [...userChatData]
    .sort((a, b) => 
      sortOrder === 'desc' ? b.chats - a.chats : a.chats - b.chats
    )
    .slice(0, displayCount)

  return (
    <Card>
      <CardContent>
        <div className="chart-header">
          <Typography variant="h6">사용자별 대화 횟수 TOP {displayCount}</Typography>
          <div className="chart-controls">
            <FormControl className="form-control">
              <InputLabel>기간</InputLabel>
              <Select 
                label="기간" 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value="daily">일간</MenuItem>
                <MenuItem value="weekly">주간</MenuItem>
                <MenuItem value="monthly">월간</MenuItem>
              </Select>
            </FormControl>
            <FormControl className="form-control">
              <InputLabel>표시 개수</InputLabel>
              <Select 
                label="표시 개수" 
                value={displayCount}
                onChange={(e) => setDisplayCount(Number(e.target.value))}
              >
                <MenuItem value={5}>TOP 5</MenuItem>
                <MenuItem value={10}>TOP 10</MenuItem>
                <MenuItem value={20}>TOP 20</MenuItem>
                <MenuItem value={50}>TOP 50</MenuItem>
              </Select>
            </FormControl>
            <FormControl className="form-control">
              <InputLabel>정렬 순서</InputLabel>
              <Select 
                label="정렬 순서" 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="desc">많은 순</MenuItem>
                <MenuItem value="asc">적은 순</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="chart-container chart-container-large">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={sortedData}
              className="chart"
            >
              <XAxis dataKey="userId" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}회`, "대화 횟수"]}
                wrapperClassName="chart-tooltip"
              />
              <Bar 
                dataKey="chats" 
                fill="var(--ibk-blue)"
                name="대화 횟수"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 
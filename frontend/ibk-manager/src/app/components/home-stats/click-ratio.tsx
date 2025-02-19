import { Card, CardContent, Typography } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import dayjs, { Dayjs } from 'dayjs'

const COLORS = {
  click: '#0051A4',    // IBK 파란색
  nonClick: '#82ca9d'  // 초록색
}

interface ClickRatioProps {
  selectedDate: Dayjs
}

export function ClickRatio({ selectedDate }: ClickRatioProps) {
  const isYesterday = selectedDate.isSame(dayjs().subtract(1, 'day'), 'day')
  const clickData = [
    { name: '클릭', value: 75, count: 750 },
    { name: '미클릭', value: 25, count: 250 },
  ]

  return (
    <Card className="stats-card">
      <CardContent className="stats-card-content">
        <Typography variant="h6" gutterBottom>
          {isYesterday ? '전일' : selectedDate.format('MM/DD')} 클릭 여부
        </Typography>
        <div className="click-ratio-chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={clickData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
              >
                {clickData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={Object.values(COLORS)[index]}
                    strokeWidth={1}
                    stroke="#fff"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  const item = clickData.find(d => d.name === name)
                  return [`${item?.count}회 (${value}%)`, name]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 
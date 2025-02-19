import { Card, CardContent, Typography } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

const clickRatioData = [
  { name: '클릭', users: 650, chats: 2500 },
  { name: '미클릭', users: 350, chats: 1500 },
]

const COLORS = {
  click: 'var(--ibk-blue)',
  nonClick: 'var(--success-green)'
}

export function ClickRatioCharts() {
  const formatTooltipValue = (value: ValueType) => {
    if (typeof value === 'number') {
      return `${value}명 (${((value / (clickRatioData[0].users + clickRatioData[1].users)) * 100).toFixed(1)}%)`
    }
    return ''
  }

  const formatChatTooltipValue = (value: ValueType) => {
    if (typeof value === 'number') {
      return `${value}회 (${((value / (clickRatioData[0].chats + clickRatioData[1].chats)) * 100).toFixed(1)}%)`
    }
    return ''
  }

  return (
    <div className="ratio-charts-grid">
      <Card>
        <CardContent>
          <div className="date-selector-area">
            <Typography variant="h6">클릭 vs 미클릭 사용자 비율</Typography>
            <div className="date-picker-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="날짜 선택" className="MuiDatePicker-root" />
              </LocalizationProvider>
            </div>
          </div>
          <div className="ratio-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="pie-chart">
                <Pie
                  data={clickRatioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="users"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}명`}
                >
                  <Cell fill={COLORS.click} />
                  <Cell fill={COLORS.nonClick} />
                </Pie>
                <Tooltip formatter={formatTooltipValue} wrapperClassName="pie-tooltip" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="ratio-legend">
            <span className="ratio-legend-item">
              <span className="ratio-legend-color" style={{ backgroundColor: COLORS.click }}></span>
              클릭: 65%
            </span>
            <span className="ratio-legend-item">
              <span className="ratio-legend-color" style={{ backgroundColor: COLORS.nonClick }}></span>
              미클릭: 35%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="date-selector-area">
            <Typography variant="h6">클릭 vs 미클릭 대화 비율</Typography>
            <div className="date-picker-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="날짜 선택" className="MuiDatePicker-root" />
              </LocalizationProvider>
            </div>
          </div>
          <div className="ratio-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="pie-chart">
                <Pie
                  data={clickRatioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="chats"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}회`}
                >
                  <Cell fill={COLORS.click} />
                  <Cell fill={COLORS.nonClick} />
                </Pie>
                <Tooltip formatter={formatChatTooltipValue} wrapperClassName="pie-tooltip" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="ratio-legend">
            <span className="ratio-legend-item">
              <span className="ratio-legend-color" style={{ backgroundColor: COLORS.click }}></span>
              클릭: 62.5%
            </span>
            <span className="ratio-legend-item">
              <span className="ratio-legend-color" style={{ backgroundColor: COLORS.nonClick }}></span>
              미클릭: 37.5%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
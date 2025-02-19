import { Card, CardContent, Typography } from "@mui/material"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useMemo } from 'react';

// 2주치 더미 데이터 생성
const generateTwoWeeksData = () => {
  const today = dayjs();
  const twoWeeksAgo = today.subtract(13, 'day');
  
  return Array.from({ length: 14 }, (_, i) => {
    const currentDate = twoWeeksAgo.add(i, 'day');
    return {
      date: currentDate.format('YYYY-MM-DD'),
      chats: Math.floor(Math.random() * 500) + 200,  // 200~700 사이 랜덤값
      users: Math.floor(Math.random() * 300) + 100,  // 100~400 사이 랜덤값
    };
  });
};

const chatData = generateTwoWeeksData();

const COLORS = {
  chats: 'var(--ibk-blue)',
  users: 'var(--success-green)'
}

export function DailyChart() {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(13, 'day'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());

  const handleStartDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setStartDate(newValue);
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setEndDate(newValue);
    }
  };

  // 선택된 날짜 범위에 따라 데이터 필터링
  const filteredData = useMemo(() => {
    return chatData.filter(item => {
      const itemDate = dayjs(item.date);
      return itemDate.isAfter(startDate, 'day') || itemDate.isSame(startDate, 'day') &&
             (itemDate.isBefore(endDate, 'day') || itemDate.isSame(endDate, 'day'));
    });
  }, [startDate, endDate]);

  return (
    <Card>
      <CardContent>
        <div className="chart-header">
          <Typography variant="h6">날짜별 대화/사용자 수 변화</Typography>
          <div className="date-picker-group">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                label="시작일" 
                value={startDate}
                onChange={handleStartDateChange}
                maxDate={endDate}
              />
              <DatePicker 
                label="종료일" 
                value={endDate}
                onChange={handleEndDateChange}
                minDate={startDate}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} className="chart">
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => dayjs(value).format('MM/DD')}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}${name === "users" ? "명" : "회"}`, 
                  name === "users" ? "사용자 수" : "대화 수"
                ]}
                labelFormatter={(label) => dayjs(label).format('YYYY-MM-DD')}
                wrapperClassName="chart-tooltip"
              />
              <Line type="monotone" dataKey="chats" stroke={COLORS.chats} name="chats" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke={COLORS.users} name="users" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 
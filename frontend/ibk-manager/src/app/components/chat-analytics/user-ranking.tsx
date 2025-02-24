'use client';

import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react'
import { getUserRankingData } from '@/app/api/chat-analytics';
import type { UserRankingData } from '@/app/api/chat-analytics/types';

export function UserRanking() {
  const [period, setPeriod] = useState('daily');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [displayCount, setDisplayCount] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [chartData, setChartData] = useState<UserRankingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getUserRankingData(
        period, 
        displayCount, 
        sortOrder,
        startDate?.format('YYYY-MM-DD'),
        endDate?.format('YYYY-MM-DD')
      );
      if (response.success) {
        setChartData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user ranking data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, displayCount, sortOrder, startDate, endDate]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    if (value !== 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleBarClick = (data: UserRankingData) => {
    navigator.clipboard.writeText(data.userName)
      .then(() => {
        alert(`사용자 이름이 복사되었습니다.`);
      })
      .catch(err => {
        console.error('클립보드 복사 실패:', err);
      });
  };

  return (
    <Card>
      <CardContent>
        <div className="chart-header">
          <Typography variant="h6">사용자별 대화 횟수 TOP {displayCount}</Typography>
          <div className="chart-controls">
            {period === 'custom' && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="date-picker-group">
                  <DatePicker 
                    label="시작일" 
                    value={startDate}
                    onChange={setStartDate}
                    maxDate={endDate || undefined}
                  />
                  <DatePicker 
                    label="종료일" 
                    value={endDate}
                    onChange={setEndDate}
                    minDate={startDate || undefined}
                  />
                </div>
              </LocalizationProvider>
            )}
            <FormControl className="form-control">
              <InputLabel>기간</InputLabel>
              <Select 
                label="기간" 
                value={period}
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                <MenuItem value="daily">일간</MenuItem>
                <MenuItem value="weekly">주간</MenuItem>
                <MenuItem value="monthly">월간</MenuItem>
                <MenuItem value="custom">기간 지정</MenuItem>
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
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <MenuItem value="desc">많은 순</MenuItem>
                <MenuItem value="asc">적은 순</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="chart-container chart-container-large">
          {isLoading ? (
            <div className="loading-container">
              <Typography>데이터를 불러오는 중...</Typography>
            </div>
          ) : chartData.length === 0 ? (
            <div className="empty-container">
              <Typography>
                {period === 'custom' 
                  ? '해당 기간에'
                  : period === 'daily' 
                    ? '오늘의' 
                    : period === 'weekly' 
                      ? '이번 주' 
                      : '이번 달'}
                <br />
                사용자 활동 데이터가 없습니다
              </Typography>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData}
                className="chart"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="userName"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}회`, "대화 횟수"]}
                  wrapperClassName="chart-tooltip"
                />
                <Bar 
                  dataKey="chats" 
                  fill="var(--ibk-blue)"
                  name="대화 횟수"
                  onClick={handleBarClick}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 
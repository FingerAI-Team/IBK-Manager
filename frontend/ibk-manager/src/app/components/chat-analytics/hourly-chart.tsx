'use client';

import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { getHourlyChartData } from '@/app/api/chat-analytics';
import type { HourlyChartData } from '@/app/api/chat-analytics/types';

export function HourlyChart() {
  const [dateType, setDateType] = useState('today');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [chartData, setChartData] = useState<HourlyChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getHourlyChartData(
        dateType,
        startDate?.format('YYYY-MM-DD'),
        endDate?.format('YYYY-MM-DD')
      );
      if (response.success) {
        setChartData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch hourly chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateType, startDate, endDate]);

  const handleDateTypeChange = (value: string) => {
    setDateType(value);
    if (value !== 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="chart-header">
          <Typography variant="h6">시간대별 대화량</Typography>
          <div className="chart-controls">
            {dateType === 'custom' && (
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
          {isLoading ? (
            <div className="loading-container">
              <Typography>데이터를 불러오는 중...</Typography>
            </div>
          ) : chartData.length === 0 ? (
            <div className="empty-container">
              <Typography>
                {dateType === 'custom' 
                  ? `${startDate?.format('YYYY.MM.DD')} ~ ${endDate?.format('YYYY.MM.DD')} 기간에`
                  : dateType === 'today' 
                    ? '오늘'
                    : dateType === 'yesterday'
                      ? '어제'
                      : dateType === 'thisWeek'
                        ? '이번 주'
                        : '이번 달'
                }
                <br />
                수집된 데이터가 없습니다
              </Typography>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} className="chart">
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={(value) => `${value}시`}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}회`, "대화 수"]}
                  labelFormatter={(label) => `${label}시`}
                  wrapperClassName="chart-tooltip"
                />
                <Bar 
                  dataKey="chats" 
                  fill="var(--ibk-blue)" 
                  name="대화 수"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 
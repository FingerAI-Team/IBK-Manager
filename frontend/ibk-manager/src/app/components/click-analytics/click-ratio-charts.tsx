'use client';

import { Card, CardContent, Typography } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { getClickRatio } from '@/app/api/click-analytics';
import type { ClickRatioData } from '@/app/api/click-analytics/types';

const COLORS = {
  click: 'var(--ibk-blue)',
  nonClick: 'var(--success-green)'
}

export function ClickRatioCharts() {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [ratioData, setRatioData] = useState<ClickRatioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getClickRatio(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
      );
      if (response.success) {
        setRatioData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch click ratio data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const getUsersPieData = () => {
    if (!ratioData) return [];
    return [
      { name: '클릭', value: ratioData.clicked.users },
      { name: '미클릭', value: ratioData.notClicked.users }
    ];
  };

  const getChatsPieData = () => {
    if (!ratioData) return [];
    return [
      { name: '클릭', value: ratioData.clicked.chats },
      { name: '미클릭', value: ratioData.notClicked.chats }
    ];
  };

  const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  const formatTooltipValue = (value: ValueType, total: number) => {
    if (typeof value === 'number') {
      return `${value}명 (${calculatePercentage(value, total)}%)`;
    }
    return '';
  };

  const formatChatTooltipValue = (value: ValueType, total: number) => {
    if (typeof value === 'number') {
      return `${value}회 (${calculatePercentage(value, total)}%)`;
    }
    return '';
  };

  return (
    <div className="ratio-charts-container">
      <div className="date-selector-area">
        <Typography variant="h6">클릭 vs 미클릭 분석</Typography>
        <div className="date-picker-group">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              label="시작일" 
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
              maxDate={endDate}
              className="MuiDatePicker-root"
            />
            <DatePicker 
              label="종료일" 
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
              minDate={startDate}
              className="MuiDatePicker-root"
            />
          </LocalizationProvider>
        </div>
      </div>

      <div className="ratio-charts-grid">
        {isLoading ? (
          <div className="loading-container">
            <Typography>데이터를 불러오는 중...</Typography>
          </div>
        ) : !ratioData ? (
          <div className="empty-container">
            <Typography>
              {startDate.format('YYYY.MM.DD')} ~ {endDate.format('YYYY.MM.DD')} 기간에
              <br />
              수집된 데이터가 없습니다
            </Typography>
          </div>
        ) : (
          <>
            <Card>
              <CardContent>
                <Typography variant="h6" className="ratio-title">
                  <span className="ratio-title-category">👥 사용자 기준</span>
                </Typography>
                <div className="ratio-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart className="pie-chart">
                      <Pie
                        data={getUsersPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}명`}
                      >
                        <Cell fill={COLORS.click} />
                        <Cell fill={COLORS.nonClick} />
                      </Pie>
                      <Tooltip 
                        formatter={(value: ValueType) => 
                          formatTooltipValue(value, ratioData.clicked.users + ratioData.notClicked.users)
                        } 
                        wrapperClassName="pie-tooltip" 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ratio-legend">
                  <span className="ratio-legend-item">
                    <span className="ratio-legend-color" style={{ backgroundColor: COLORS.click }}></span>
                    클릭: {calculatePercentage(ratioData.clicked.users, ratioData.clicked.users + ratioData.notClicked.users)}%
                  </span>
                  <span className="ratio-legend-item">
                    <span className="ratio-legend-color" style={{ backgroundColor: COLORS.nonClick }}></span>
                    미클릭: {calculatePercentage(ratioData.notClicked.users, ratioData.clicked.users + ratioData.notClicked.users)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" className="ratio-title">
                  <span className="ratio-title-category">💬 대화 기준</span>
                </Typography>
                <div className="ratio-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart className="pie-chart">
                      <Pie
                        data={getChatsPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}회`}
                      >
                        <Cell fill={COLORS.click} />
                        <Cell fill={COLORS.nonClick} />
                      </Pie>
                      <Tooltip 
                        formatter={(value: ValueType) => 
                          formatChatTooltipValue(value, ratioData.clicked.chats + ratioData.notClicked.chats)
                        } 
                        wrapperClassName="pie-tooltip" 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ratio-legend">
                  <span className="ratio-legend-item">
                    <span className="ratio-legend-color" style={{ backgroundColor: COLORS.click }}></span>
                    클릭: {calculatePercentage(ratioData.clicked.chats, ratioData.clicked.chats + ratioData.notClicked.chats)}%
                  </span>
                  <span className="ratio-legend-item">
                    <span className="ratio-legend-color" style={{ backgroundColor: COLORS.nonClick }}></span>
                    미클릭: {calculatePercentage(ratioData.notClicked.chats, ratioData.clicked.chats + ratioData.notClicked.chats)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
} 
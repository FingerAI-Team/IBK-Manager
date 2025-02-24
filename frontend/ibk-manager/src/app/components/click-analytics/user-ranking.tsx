import { useState, useEffect } from "react"
import { Card, CardContent, Typography } from "@mui/material"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import dayjs, { Dayjs } from 'dayjs';
import { getUserClickRanking } from '@/app/api/click-analytics';
import type { UserClickData } from '@/app/api/click-analytics/types';

const COLORS = {
  clicks: 'var(--ibk-blue)',
  chats: 'var(--success-green)'
}

type SortKey = 'clicks' | 'chats';

export function UserRanking() {
  const [sortBy, setSortBy] = useState<SortKey>('clicks');
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [allData, setAllData] = useState<UserClickData[]>([]);
  const [displayData, setDisplayData] = useState<UserClickData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const transformChartData = (data: UserClickData[]) => {
    return data.slice(0, 10).map(item => ({
      ...item,
      clicks: -Math.abs(item.clicks)
    }));
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getUserClickRanking(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
      );
      if (response.success) {
        setAllData(response.data.data);
        const sortedData = [...response.data.data].sort((a, b) => b.clicks - a.clicks);
        setDisplayData(transformChartData(sortedData));
      }
    } catch (error) {
      console.error('Failed to fetch user click ranking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleSort = (key: SortKey) => {
    const sortedData = [...allData].sort((a, b) => {
      if (key === 'clicks') {
        return b.clicks - a.clicks;
      } else {
        return b.chats - a.chats;
      }
    });
    setDisplayData(transformChartData(sortedData));
    setSortBy(key);
  };

  const formatTooltipValue = (value: ValueType, name: string) => {
    if (typeof value === 'number') {
      const label = name === "chats" ? "대화 수" : "클릭 수"
      return [Math.abs(value), label]
    }
    return [0, ""]
  }

  const calculateAxisConfig = (data: UserClickData[]) => {
    const maxClicks = Math.max(...data.map(d => Math.abs(d.clicks)));
    const maxChats = Math.max(...data.map(d => d.chats));
    
    // 픽셀당 값 비율을 맞추기 위한 계산
    const DIVISIONS = 4;
    const interval = Math.ceil(Math.max(maxClicks, maxChats) / DIVISIONS);

    // 왼쪽 영역 눈금 (실제 maxClicks까지만)
    const leftTicks = [];
    for (let i = Math.ceil(maxClicks / interval); i >= 0; i--) {
      leftTicks.push(-interval * i);
    }

    // 오른쪽 영역 눈금 (실제 maxChats까지만)
    const rightTicks = [];
    for (let i = 0; i <= Math.ceil(maxChats / interval); i++) {
      rightTicks.push(interval * i);
    }

    return {
      ticks: [...new Set([...leftTicks, ...rightTicks])].sort((a, b) => a - b),
      domain: [-maxClicks, maxChats] // 실제 데이터 범위 사용
    };
  };

  const axisConfig = calculateAxisConfig(allData);

  const handleBarClick = (data: UserClickData) => {
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
        <div className="date-selector-area">
          <Typography variant="h6">📌 사용자 클릭 & 대화 횟수 비교 (TOP 10)</Typography>
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
        <div className="legend-area">
          <span 
            className={`legend-item legend-item-clicks ${sortBy === 'clicks' ? 'active' : ''}`}
            onClick={() => handleSort('clicks')}
            style={{ cursor: 'pointer' }}
          >
            🔻 클릭 횟수 (←)
          </span>
          <span className="legend-item">사용자 ID</span>
          <span 
            className={`legend-item legend-item-chats ${sortBy === 'chats' ? 'active' : ''}`}
            onClick={() => handleSort('chats')}
            style={{ cursor: 'pointer' }}
          >
            대화 횟수 (→) 🔻
          </span>
        </div>
        <div style={{ display: 'flex', width: '100%', gap: '0' }}>
          {/* 클릭 차트 (우측 정렬) */}
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={displayData}
                layout="vertical"
                mirror
                margin={{ top: 20, right: 0, left: 20, bottom: 25 }}
              >
                <XAxis 
                  type="number"
                  orientation="bottom"
                  tickFormatter={(value) => Math.abs(value).toString()}
                  label={{ 
                    value: '클릭 수', 
                    position: 'bottom',
                    offset: 15
                  }}
                />
                <YAxis 
                  type="category"
                  dataKey="userName"
                  orientation="left"
                />
                <Bar
                  dataKey="clicks"
                  fill={COLORS.clicks}
                  name="클릭 수"
                  onClick={handleBarClick}
                  style={{ cursor: 'pointer' }}
                />
                <Tooltip formatter={(value) => Math.abs(value) + '회'} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 대화 차트 (좌측 정렬) */}
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={displayData}
                layout="vertical"
                margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
              >
                <XAxis 
                  type="number"
                  orientation="bottom"
                  label={{ 
                    value: '대화 수', 
                    position: 'bottom',
                    offset: 15
                  }}
                />
                <YAxis 
                  type="category"
                  dataKey="userName"
                  hide
                />
                <Bar
                  dataKey="chats"
                  fill={COLORS.chats}
                  name="대화 수"
                  onClick={handleBarClick}
                  style={{ cursor: 'pointer' }}
                />
                <Tooltip formatter={(value) => value + '회'} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
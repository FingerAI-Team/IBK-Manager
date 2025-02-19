import { DateSelector } from './date-selector'
import { ChatCount } from './chat-count'
import { UserCount } from './user-count'
import { ClickRatio } from './click-ratio'
import { PredictionCount } from './prediction-count'
import { useState } from 'react'
import dayjs from 'dayjs'
import './styles.css'

export function HomeStats() {
  const [selectedDate, setSelectedDate] = useState(dayjs().subtract(1, 'day'))

  return (
    <div className="home-stats-container">
      <div className="date-selector-wrapper">
        <DateSelector onDateChange={setSelectedDate} />
      </div>
      <div className="stats-grid">
        <ChatCount selectedDate={selectedDate} />
        <UserCount selectedDate={selectedDate} />
        <ClickRatio selectedDate={selectedDate} />
        <PredictionCount selectedDate={selectedDate} />
      </div>
    </div>
  )
} 
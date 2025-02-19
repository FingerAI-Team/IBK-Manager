import { Card, CardContent, Typography } from "@mui/material"
import { SearchFilters } from './search-filters'
import { ChatTable } from './chat-table'
import './styles.css'

export function ChatContent() {
  return (
    <div className="chat-content-container">
      <Card>
        <CardContent>
          <div className="chat-content-header">
            <Typography variant="h6">대화 내용 조회</Typography>
            <SearchFilters />
          </div>
          <ChatTable />
        </CardContent>
      </Card>
    </div>
  )
} 
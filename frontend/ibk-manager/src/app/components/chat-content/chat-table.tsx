import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react'

const chatData = [
  {
    id: 1,
    timestamp: "2024-02-01",
    userId: "user_1",
    question: "삼성전자 전망 어떻게 보나요?",
    isStock: true,
  },
  {
    id: 2,
    userId: "user_2",
    question: "ETF 투자할 때 고려해야 할 점?",
    timestamp: "2024-02-02",
    isStock: true,
  },
  {
    id: 3,
    userId: "user_3",
    question: "오늘 날씨 어떤가요?",
    timestamp: "2024-02-03",
    isStock: false,
  },
  {
    id: 4,
    userId: "user_4",
    question: "다음달 여행 가려면 어디가 좋을까요?",
    timestamp: "2024-02-04",
    isStock: false,
  },
  {
    id: 5,
    userId: "user_5",
    question: "카카오 주식 지금 매수해도 될까요?",
    timestamp: "2024-02-05",
    isStock: true,
  },
  {
    id: 6,
    userId: "user_6",
    question: "S&P 500 ETF를 추천받고 싶어요.",
    timestamp: "2024-02-06",
    isStock: true,
  }
]

export function ChatTable() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const currentPageData = chatData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <>
      <TableContainer component={Paper} className="chat-table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>날짜</TableCell>
              <TableCell>사용자 ID</TableCell>
              <TableCell>질문 내용</TableCell>
              <TableCell>종목 여부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.timestamp}</TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.question}</TableCell>
                <TableCell>
                  <div className={`stock-badge stock-badge-${row.isStock}`}>
                    {row.isStock ? (
                      <>
                        <CheckCircleIcon fontSize="small" />
                        <span>종목</span>
                      </>
                    ) : (
                      <>
                        <CancelIcon fontSize="small" />
                        <span>일반</span>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={chatData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="페이지당 행 수:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} / 전체 ${count}`
        }
      />
    </>
  )
} 
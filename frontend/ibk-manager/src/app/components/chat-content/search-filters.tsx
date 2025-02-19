import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from "@mui/material"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';

export function SearchFilters() {
  return (
    <div className="search-filters">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="시작일" />
        <DatePicker label="종료일" />
      </LocalizationProvider>
      
      <FormControl className="search-form-control">
        <InputLabel>사용자</InputLabel>
        <Select label="사용자" defaultValue="all">
          <MenuItem value="all">전체</MenuItem>
          <MenuItem value="user_1">user_1</MenuItem>
          <MenuItem value="user_2">user_2</MenuItem>
          <MenuItem value="user_3">user_3</MenuItem>
        </Select>
      </FormControl>

      <FormControl className="search-form-control">
        <InputLabel>종목 여부</InputLabel>
        <Select label="종목 여부" defaultValue="all">
          <MenuItem value="all">전체</MenuItem>
          <MenuItem value="stock">종목</MenuItem>
          <MenuItem value="non-stock">일반</MenuItem>
        </Select>
      </FormControl>

      <TextField 
        label="키워드 검색" 
        size="small" 
        placeholder="검색어 입력"
      />

      <Button 
        variant="contained" 
        startIcon={<SearchIcon />}
        className="search-button"
      >
        검색
      </Button>
    </div>
  )
} 
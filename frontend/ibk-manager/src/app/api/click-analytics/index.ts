import { ApiResponse, UserClickRankingResponse, ClickRatioResponse } from './types';
import { fetchWithAuth } from '@/utils/fetch';

const BASE_URL = 'http://localhost:8000/api/click-analytics';

// 사용자별 클릭/대화 데이터 조회
export async function getUserClickRanking(
  startDate: string,
  endDate: string
): Promise<ApiResponse<UserClickRankingResponse>> {
  return fetchWithAuth(
    `${BASE_URL}/user-ranking?startDate=${startDate}&endDate=${endDate}`
  );
}

// 클릭 비율 데이터 조회
export async function getClickRatio(
  startDate: string,
  endDate: string
): Promise<ApiResponse<ClickRatioResponse>> {
  return fetchWithAuth(
    `${BASE_URL}/ratio?startDate=${startDate}&endDate=${endDate}`
  );
} 
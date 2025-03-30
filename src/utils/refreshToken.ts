import { api } from "../contexts/AuthContext";

// 토큰 갱신 함수
export const refreshTokens = async (): Promise<boolean> => {
  try {
    const response = await api.post("/auth/refresh-token");
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

// 응답 인터셉터 설정 함수
export const setupResponseInterceptor = (logout: () => Promise<void>) => {
  // 이전 인터셉터 제거 (중복 방지)
  api.interceptors.response.eject(0);

  // 새 인터셉터 추가
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 401 에러이고 재시도하지 않은 요청인 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // 토큰 갱신 시도
          const refreshed = await refreshTokens();

          if (refreshed) {
            // 토큰 갱신 성공 시 원래 요청 재시도
            return api(originalRequest);
          } else {
            // 토큰 갱신 실패 시 로그아웃
            await logout();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // 토큰 갱신 중 에러 발생 시 로그아웃
          await logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

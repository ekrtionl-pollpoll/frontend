import axios from "axios";

// API 기본 URL 설정
const API_URL = "http://localhost:5500/api/v1";

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data });
  }
);

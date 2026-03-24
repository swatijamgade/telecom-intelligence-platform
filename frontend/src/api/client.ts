import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export type ApiErrorPayload = {
  success?: false;
  error?: {
    code?: string;
    message?: string;
    status?: number;
    details?: unknown;
  };
  // backward-compat fallback (old backend error shape)
  message?: string;
  details?: Array<{ field?: string | null; message?: string; code?: string }>;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return (
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.response?.data?.details?.[0]?.message ||
      error.message ||
      "Request failed"
    );
  }
  return "Unexpected error occurred";
}

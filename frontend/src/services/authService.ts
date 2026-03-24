import { apiClient } from "../api/client";
import type { ApiSuccessResponse } from "../api/client";
import type { AuthResponse, LoginPayload, SignupPayload, User } from "../types/auth";

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>("/auth/signup", payload);
  return response.data.data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>("/auth/login", payload);
  return response.data.data;
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<ApiSuccessResponse<User>>("/auth/me");
  return response.data.data;
}

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get<ApiSuccessResponse<User[]>>("/auth/users");
  return response.data.data;
}

export async function createUser(payload: SignupPayload): Promise<User> {
  const response = await apiClient.post<ApiSuccessResponse<User>>("/auth/users", payload);
  return response.data.data;
}

export async function removeUser(userId: string): Promise<{ status: string; user_id: string }> {
  const response = await apiClient.delete<ApiSuccessResponse<{ status: string; user_id: string }>>(`/auth/users/${userId}`);
  return response.data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post<ApiSuccessResponse<{ status: string }>>("/auth/logout");
}

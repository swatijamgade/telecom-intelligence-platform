export type UserRole = "admin" | "analyst";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface TokenData {
  access_token: string;
  token_type: "bearer";
  expires_in_seconds: number;
}

export interface AuthResponse {
  user: User;
  token: TokenData;
}

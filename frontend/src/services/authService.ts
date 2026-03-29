import { apiClient } from "../api/client";
import type { ApiSuccessResponse } from "../api/client";
import type { AuthResponse, LoginPayload, SignupPayload, User } from "../types/auth";

type LocalAuthState = {
  users: User[];
  currentUserId: string | null;
};

const LOCAL_AUTH_STORAGE_KEY = "tip.localAuthState";
const useLocalAuth = import.meta.env.DEV && import.meta.env.VITE_USE_LOCAL_AUTH !== "false";

function nowIso() {
  return new Date().toISOString();
}

function nextId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function defaultUsers(): User[] {
  const createdAt = nowIso();
  return [
    {
      id: "local-admin",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      created_at: createdAt,
    },
    {
      id: "local-analyst",
      name: "Analyst User",
      email: "analyst@example.com",
      role: "analyst",
      created_at: createdAt,
    },
  ];
}

function readLocalState(): LocalAuthState {
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
    if (!raw) {
      return { users: defaultUsers(), currentUserId: null };
    }
    const parsed = JSON.parse(raw) as LocalAuthState;
    if (!Array.isArray(parsed.users)) {
      return { users: defaultUsers(), currentUserId: null };
    }
    return {
      users: parsed.users,
      currentUserId: parsed.currentUserId ?? null,
    };
  } catch {
    return { users: defaultUsers(), currentUserId: null };
  }
}

function writeLocalState(state: LocalAuthState) {
  localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(state));
}

function buildAuthResponse(user: User): AuthResponse {
  return {
    user,
    token: {
      access_token: "local-dev-token",
      token_type: "bearer",
      expires_in_seconds: 86_400,
    },
  };
}

function inferRoleFromEmail(email: string): User["role"] {
  return email.toLowerCase().includes("admin") ? "admin" : "analyst";
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  if (useLocalAuth) {
    const state = readLocalState();
    const email = payload.email.trim().toLowerCase();
    const existing = state.users.find((user) => user.email.toLowerCase() === email);
    if (existing) {
      state.currentUserId = existing.id;
      writeLocalState(state);
      return buildAuthResponse(existing);
    }

    const user: User = {
      id: nextId(),
      name: payload.name.trim() || "User",
      email,
      role: payload.role ?? inferRoleFromEmail(email),
      created_at: nowIso(),
    };
    state.users.push(user);
    state.currentUserId = user.id;
    writeLocalState(state);
    return buildAuthResponse(user);
  }

  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>("/auth/signup", payload);
  return response.data.data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (useLocalAuth) {
    const state = readLocalState();
    const email = payload.email.trim().toLowerCase();
    let user = state.users.find((item) => item.email.toLowerCase() === email);

    if (!user) {
      user = {
        id: nextId(),
        name: email.split("@")[0] || "User",
        email,
        role: inferRoleFromEmail(email),
        created_at: nowIso(),
      };
      state.users.push(user);
    }

    state.currentUserId = user.id;
    writeLocalState(state);
    return buildAuthResponse(user);
  }

  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>("/auth/login", payload);
  return response.data.data;
}

export async function getMe(): Promise<User> {
  if (useLocalAuth) {
    const state = readLocalState();
    const user = state.users.find((item) => item.id === state.currentUserId);
    if (!user) {
      throw new Error("Unauthenticated");
    }
    return user;
  }

  const response = await apiClient.get<ApiSuccessResponse<User>>("/auth/me");
  return response.data.data;
}

export async function getUsers(): Promise<User[]> {
  if (useLocalAuth) {
    const state = readLocalState();
    return state.users;
  }

  const response = await apiClient.get<ApiSuccessResponse<User[]>>("/auth/users");
  return response.data.data;
}

export async function createUser(payload: SignupPayload): Promise<User> {
  if (useLocalAuth) {
    const state = readLocalState();
    const email = payload.email.trim().toLowerCase();
    const existing = state.users.find((user) => user.email.toLowerCase() === email);
    if (existing) {
      return existing;
    }

    const user: User = {
      id: nextId(),
      name: payload.name.trim() || "User",
      email,
      role: payload.role ?? inferRoleFromEmail(email),
      created_at: nowIso(),
    };
    state.users.push(user);
    writeLocalState(state);
    return user;
  }

  const response = await apiClient.post<ApiSuccessResponse<User>>("/auth/users", payload);
  return response.data.data;
}

export async function removeUser(userId: string): Promise<{ status: string; user_id: string }> {
  if (useLocalAuth) {
    const state = readLocalState();
    state.users = state.users.filter((user) => String(user.id) !== String(userId));
    if (state.currentUserId === String(userId)) {
      state.currentUserId = null;
    }
    writeLocalState(state);
    return { status: "deleted", user_id: String(userId) };
  }

  const response = await apiClient.delete<ApiSuccessResponse<{ status: string; user_id: string }>>(`/auth/users/${userId}`);
  return response.data.data;
}

export async function logout(): Promise<void> {
  if (useLocalAuth) {
    const state = readLocalState();
    state.currentUserId = null;
    writeLocalState(state);
    return;
  }

  await apiClient.post<ApiSuccessResponse<{ status: string }>>("/auth/logout");
}

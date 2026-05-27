import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import type {
  SessionConfig,
  Session,
  Result,
  CreateSessionResponse,
  StartSessionResponse,
  GetSessionResponse,
  SendMessageResponse,
  EndSessionResponse,
} from "@/types/session.types";

const API_BASE_URL = "http://localhost:5000/api";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  });

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  isOnBoarded?: boolean;
  authProvided?: string;
}

interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

interface UpdatePasswordResponse {
  message: string;
  user: AuthUser;
}

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: { name: string; email: string; password: string }) =>
    fetchApi<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  googleLogin: (data: { email: string; name: string }) =>
    fetchApi<AuthResponse>("/auth/login-with-google", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updatePassword: (data: { newPassword: string }) =>
    fetchApi<UpdatePasswordResponse>("/auth/update-password", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updatePassword,
    onSuccess: (data) => {
      const updatedUser = { ...data.user, isOnBoarded: true };
      useAuthStore
        .getState()
        .setAuth(updatedUser, useAuthStore.getState().token!);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () =>
      fetchApi<{ id: string; name: string; email: string; picture?: string }>(
        "/user",
      ),
    staleTime: 5 * 60 * 1000,
  });
};

export const sessionApi = {
  createSession: (config: SessionConfig) =>
    fetchApi<CreateSessionResponse>("/session/create", {
      method: "POST",
      body: JSON.stringify({ config }),
    }),

  startSession: (sessionId: string) =>
    fetchApi<StartSessionResponse>(`/session/${sessionId}/start`, {
      method: "POST",
    }),

  getSession: (sessionId: string) =>
    fetchApi<GetSessionResponse>(`/session/${sessionId}`),

  sendMessage: (sessionId: string, message: string, isComplete = false) =>
    fetchApi<SendMessageResponse>(`/session/${sessionId}/message`, {
      method: "POST",
      body: JSON.stringify({ message, isComplete }),
    }),

  endSession: (sessionId: string) =>
    fetchApi<EndSessionResponse>(`/session/${sessionId}/end`, {
      method: "POST",
    }),

  getUserSessions: (page = 1, limit = 10) =>
    fetchApi<{ sessions: Session[]; total: number; page: number; limit: number }>(
      `/session/?page=${page}&limit=${limit}`,
    ),
};

export const useCreateSession = () => {
  return useMutation({
    mutationFn: sessionApi.createSession,
  });
};

export const useStartSession = () => {
  return useMutation({
    mutationFn: sessionApi.startSession,
  });
};

export const useGetSession = (sessionId: string) => {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => sessionApi.getSession(sessionId),
    enabled: !!sessionId,
  });
};

export const useGetSessionResults = (sessionId: string) => {
  return useQuery({
    queryKey: ["results", sessionId],
    queryFn: async (): Promise<{ result: Result; session: Session }> => {
      const data = await sessionApi.getSession(sessionId);
      if (!data.session.result) {
        throw new Error("Results not available yet");
      }
      return { result: data.session.result as Result, session: data.session };
    },
    enabled: !!sessionId,
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({
      sessionId,
      message,
      isComplete,
    }: {
      sessionId: string
      message: string
      isComplete?: boolean
    }) => sessionApi.sendMessage(sessionId, message, isComplete),
  });
};

export const useEndSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sessionApi.endSession,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
    },
  });
};

export const useGetUserSessions = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["user-sessions", page, limit],
    queryFn: () => sessionApi.getUserSessions(page, limit),
  });
};

export default {
  authApi,
  sessionApi,
  useLogin,
  useRegister,
  useGoogleLogin,
  useUpdatePassword,
  useUser,
  useCreateSession,
  useStartSession,
  useGetSession,
  useGetSessionResults,
  useSendMessage,
  useEndSession,
  useGetUserSessions,
};

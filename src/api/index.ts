import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

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

export default {
  authApi,
  useLogin,
  useRegister,
  useGoogleLogin,
  useUpdatePassword,
  useUser,
};

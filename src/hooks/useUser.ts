import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/config/apiClient";
import { useAuthStore } from "@/store/authStore";
import { TFormSchema } from "@/lib/types";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export const useUser = () => {
  const queryClient = useQueryClient();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<AuthResponse>("/users/me");
      return response.data.user;
    },
    enabled: useAuthStore.getState().isAuthenticated,
  });

  const setUser = (userData: User | null) => {
    queryClient.setQueryData(["user"], userData);
  };

  const signInMutation = useMutation<AuthResponse, Error, TFormSchema>({
    mutationFn: async (data) => api.post("/auth/sign-in", data),
    onSuccess: (data) => {
      setUser(data.user);
      setIsAuthenticated(true);
    },
  });

  const signUpMutation = useMutation<AuthResponse, Error, TFormSchema>({
    mutationFn: async (data) => api.post("/auth/sign-up", data),
    onSuccess: (data) => {
      console.log("회원가입 성공:", data);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/sign-out");
    },
    onSuccess: () => {
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    setUser,
    signInMutation,
    signUpMutation,
    signOutMutation,
  };
};

import { api, setCsrfToken } from "../api/auth";
import { useEffect, useState, type PropsWithChildren } from "react";
import { AuthContext } from "./useAuth";

type AuthProviderProps = PropsWithChildren;

const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to load user from storage:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(getUserFromStorage());
  const [csrfToken, setCsrfTokenState] = useState<string | null>();

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // ✅ 로그인 유지
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/sign-in", { email, password });

      const { user, csrfToken } = response.data.data;
      console.log(response);
      console.log(user);
      console.log(csrfToken);
      setCsrfToken(csrfToken);
      setUser(user);
      setCsrfTokenState(csrfToken);
    } catch (error) {
      console.error("Sign in failed:", error);
      setUser(null);
      setCsrfToken(null);
      setCsrfTokenState(null);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const response = await api.post("/auth/sign-out");

      setUser(null);
      setCsrfTokenState(null);
      setCsrfToken(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Sign out failed:", error);
      setUser(null);
      setCsrfTokenState(null);
      setCsrfToken(null);
      throw error;
    }
  };

  const value = {
    user,
    csrfToken,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

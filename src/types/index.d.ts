interface User {
  userId: string;
  username: string;
  email: string;
  profile_image?: string | null;
  bio?: string | null;
  is_active: boolean;
  last_login?: Date | null;
}

interface AuthContextType {
  user: User | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

type FormType = "sign-in" | "sign-up";

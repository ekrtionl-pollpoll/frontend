import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren;
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // const { user } = useAuth();
  const user = { username: "test" };
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  console.log(user);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return children;
};

export default ProtectedRoute;

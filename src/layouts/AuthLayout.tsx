import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className='auth-layout'>
      {/* // <div className='flex items-center justify-center mx-auto max-w-7xl min-h-screen max-sm:px-4 max-sm:py-8'> */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;

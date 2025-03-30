import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";

const MainLayout = () => {
  return (
    <div className='root-layout'>
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
};
export default MainLayout;

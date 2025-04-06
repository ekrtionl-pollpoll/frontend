import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className='root-layout'>
      <Navbar />
      <Outlet />
    </div>
  );
};
export default MainLayout;

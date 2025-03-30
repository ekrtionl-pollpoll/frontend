import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <div className='root-layout'>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default ProfileLayout

import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const VoteLayout = () => {
  return (
    <div className="root-layout">
      <Navbar />
      <Outlet />
    </div>
  ) 
}

export default VoteLayout

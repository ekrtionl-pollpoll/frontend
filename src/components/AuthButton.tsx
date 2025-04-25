import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { motion } from "framer-motion"; // You may need to install framer-motion
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

interface AuthButtonsProps {
  isLoggedIn: boolean;
  signOut: () => void;
  username?: string;
}

const AuthButtons = ({
  isLoggedIn,
  signOut,
  username = "User",
}: AuthButtonsProps) => {
  const { signOutMutation } = useUser();

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("로그아웃 되었습니다.");
      },
    });
  };

  return (
    <div className='hidden md:block'>
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='relative group px-4 py-2 rounded-full border border-transparent hover:border-blue-400/30 hover:bg-blue-500/10 transition-all duration-300'
            >
              <motion.div
                className='absolute inset-0 rounded-full bg-blue-400/10 opacity-0 group-hover:opacity-100'
                initial={{ scale: 0.9, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <span className='flex items-center gap-2 z-10 relative'>
                <User className='h-4 w-4 text-blue-400' />
                <span className='font-medium'>{username}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to='/profile' className='cursor-pointer'>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/votes' className='cursor-pointer'>
                <svg
                  className='mr-2 h-4 w-4'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect
                    x='4'
                    y='4'
                    width='16'
                    height='16'
                    rx='2'
                    stroke='currentColor'
                    strokeWidth='2'
                  />
                  <path
                    d='M9 10V14M15 10V14'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
                <span>My Votes</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className='text-red-500 focus:text-red-500 cursor-pointer'
            >
              <LogOut className='mr-2 h-4 w-4' />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to='/signin'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300'>
              <LogIn className='mr-2 h-4 w-4' />
              Sign in
            </Button>
          </motion.div>
        </Link>
      )}
    </div>
  );
};

export default AuthButtons;

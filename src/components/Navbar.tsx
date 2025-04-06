import { Link } from "react-router-dom";
import { Button } from "./ui/button";
// import { useAuth } from "../contexts/useAuth";
import { useState } from "react";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import AuthButtons from "./AuthButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { user, signOut } = useAuth();
  const signOut = () => {};
  const user = { username: "test" };
  const isLoggedIn = false;

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return path !== "/" && location.pathname.startsWith(path);
  };

  return (
    <nav className='bg-[#1e2642] rounded-lg p-4'>
      <div className='max-w-7xl mx-auto px-4 '>
        <div className='flex items-center justify-between h-16'>
          {/* Logo and brand */}
          <Link to='/' className='flex items-center gap-2'>
            <img src='/assets/logo.png' alt='logo' width={38} height={38} />
            <h2 className='text-primary-100 text-xl font-bold'>PollPoll</h2>
            {/* <img src='/assets/logoName.png' alt='logoName' width={100} height={38} /> */}
          </Link>

          {/* Desktop navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <Link
              to='/votes'
              className={`text-lg text-center transition-colors ${
                isActive("/votes")
                  ? "text-blue-400 font-medium border-b-2 border-blue-400"
                  : "text-white hover:text-blue-300"
              }`}
            >
              Votes
            </Link>
            <Link
              to='/boards'
              className={`text-lg text-center transition-colors ${
                isActive("/boards")
                  ? "text-blue-400 font-medium border-b-2 border-blue-400"
                  : "text-white hover:text-blue-300"
              }`}
            >
              Boards
            </Link>
            <Link
              to='/trending'
              className={`text-lg text-center transition-colors ${
                isActive("/trending")
                  ? "text-blue-400 font-medium border-b-2 border-blue-400"
                  : "text-white hover:text-blue-300"
              }`}
            >
              Trending
            </Link>
            <Link
              to='/custom-profile'
              className={`text-lg text-center transition-colors ${
                isActive("/custom-profile")
                  ? "text-blue-400 font-medium border-b-2 border-blue-400"
                  : "text-white hover:text-blue-300"
              }`}
            >
              Custom Profile
            </Link>
          </div>

          {/* Desktop auth button */}
          <AuthButtons
            isLoggedIn={isLoggedIn}
            signOut={signOut}
            username={user?.username || "User"}
          />

          {/* Mobile menu button */}
          <div className='flex items-center md:hidden'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className='sr-only'>Open main menu</span>
              {isMenuOpen ? (
                <X className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className='px-2 pt-2 pb-3 space-y-3 border-t border-gray-700'>
          <Link
            to='/votes'
            className='text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium'
            onClick={() => setIsMenuOpen(false)}
          >
            Votes
          </Link>
          <Link
            to='/boards'
            className='text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium'
            onClick={() => setIsMenuOpen(false)}
          >
            Boards
          </Link>
          <Link
            to='/trending'
            className='text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium'
            onClick={() => setIsMenuOpen(false)}
          >
            Trending
          </Link>

          {/* Mobile auth button */}
          <div className='pt-2'>
            {isLoggedIn ? (
              <Button
                variant='destructive'
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className='w-full justify-center group transition-all duration-300'
              >
                <LogOut className='mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300' />
                Sign out
              </Button>
            ) : (
              <Link
                to='/signin'
                className='block w-full'
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className='w-full justify-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 group transition-all duration-300'>
                  <LogIn className='mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300' />
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => navigateTo('/')}
        >
          <div className="relative w-10 h-10 flex items-center justify-center bg-rescue-primary rounded-full overflow-hidden mr-3">
            <span className="text-white text-lg font-bold">R</span>
          </div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rescue-primary to-rescue-tertiary">
            Rescue Map Hub
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-1">
          <button 
            onClick={() => navigateTo('/')} 
            className={`nav-item ${isActivePath('/') ? 'nav-item-active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => navigateTo('/map')} 
            className={`nav-item ${isActivePath('/map') ? 'nav-item-active' : ''}`}
          >
            Map
          </button>
          <button 
            onClick={() => navigateTo('/chat')} 
            className={`nav-item ${isActivePath('/chat') ? 'nav-item-active' : ''}`}
          >
            Chat
          </button>
          
          {user.isAuthenticated && (
            <div className="ml-6 flex items-center">
              <div className="mr-4 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                {user.username}
              </div>
              <button 
                onClick={logout}
                className="p-2 text-gray-500 hover:text-rescue-primary transition-colors"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 pt-16 bg-white/95 backdrop-blur-sm animate-fade-in">
          <nav className="flex flex-col items-center justify-center h-full space-y-6">
            <button 
              onClick={() => navigateTo('/')} 
              className={`text-xl ${isActivePath('/') ? 'text-rescue-primary font-semibold' : 'text-gray-700'}`}
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('/map')} 
              className={`text-xl ${isActivePath('/map') ? 'text-rescue-primary font-semibold' : 'text-gray-700'}`}
            >
              Map
            </button>
            <button 
              onClick={() => navigateTo('/chat')} 
              className={`text-xl ${isActivePath('/chat') ? 'text-rescue-primary font-semibold' : 'text-gray-700'}`}
            >
              Chat
            </button>
            
            {user.isAuthenticated && (
              <div className="flex flex-col items-center mt-6 pt-6 border-t border-gray-200 w-1/2">
                <div className="mb-2 px-4 py-2 bg-gray-100 rounded-full text-base font-medium">
                  {user.username}
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center text-rescue-primary font-medium"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

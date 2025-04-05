import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Menu, ShieldQuestion } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [receiveInfo, setReceiveInfo] = useState("");
  const [receiveSuggest, setReceiveSuggest] = useState("");
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  const dropDownInfo = async () => {
    setSuggestOpen(false);  
    setInfoOpen(!infoOpen); 
    try {
      const response = await fetch('api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: user.id }), // Gửi ID người dùng
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      setReceiveInfo(data);  // Lưu dữ liệu vào state
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  const dropDownSuggest = async () => {
    setInfoOpen(false);  
    setSuggestOpen(!suggestOpen); 
    try {
      const response = await fetch('api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: user.id }), // Gửi ID người dùng
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setReceiveSuggest(data);  // Lưu gợi ý vào state
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigateTo("/")}
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
            onClick={() => navigateTo("/")}
            className={`nav-item ${isActivePath("/") ? "nav-item-active" : ""}`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo("/map")}
            className={`nav-item ${
              isActivePath("/map") ? "nav-item-active" : ""
            }`}
          >
            Map
          </button>
          <button
            onClick={() => navigateTo("/chat")}
            className={`nav-item ${
              isActivePath("/chat") ? "nav-item-active" : ""
            }`}
          >
            Chat
          </button>

          <button
            onClick={() => navigateTo("/groupChat")}
            className={`nav-item ${
              isActivePath("/groupChat") ? "nav-item-active" : ""
            }`}
          >
            Group Chat
          </button>

          {user.isAuthenticated && (
            <div className="ml-6 flex items-center">
                <button onClick={dropDownInfo} className="mb-2 px-4 py-2 bg-gray-100 rounded-full text-base font-medium">
                  {user.username}
                </button>
                {/* Dropdown hiển thị thông tin người dùng */}
                {infoOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-md p-4 border text-sm text-gray-700 z-10">
                    <p> Tên: {user.username}</p>
                    <p> Email:  </p>
                    <p> Số điện thoại: </p>
                  </div>
                )}

                {/* suggest here */}
                <button onClick={dropDownSuggest} className="flex flex-wrap ml-2 mb-2 px-4 py-2 bg-gray-100 rounded-full text-base font-medium">
                <ShieldQuestion />  Gợi ý
                </button>
                {/* Dropdown hiển thị thông tin người dùng */}
                {suggestOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-md p-4 border text-sm text-gray-700 z-10">
                    <p> chết mẹ di </p>
                    
                  </div>
                )}

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
              onClick={() => navigateTo("/")}
              className={`text-xl ${
                isActivePath("/")
                  ? "text-rescue-primary font-semibold"
                  : "text-gray-700"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo("/map")}
              className={`text-xl ${
                isActivePath("/map")
                  ? "text-rescue-primary font-semibold"
                  : "text-gray-700"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => navigateTo("/chat")}
              className={`text-xl ${
                isActivePath("/chat")
                  ? "text-rescue-primary font-semibold"
                  : "text-gray-700"
              }`}
            >
              Chat
            </button>

            {user.isAuthenticated && (
              <div className="flex flex-col items-center mt-6 pt-6 border-t border-gray-200 w-1/2">
                <button onClick={dropDownInfo} className="mb-2 px-4 py-2 bg-gray-100 rounded-full text-base font-medium">
                  {/* {user.username} */}
                </button>
                {/* Dropdown hiển thị thông tin người dùng */}
                {infoOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-md p-4 border text-sm text-gray-700 z-10">
                    <p><strong>📧 Email:</strong> {user.username}</p>
                    {/* Có thể thêm thông tin khác ở đây */}
                  </div>
                )}
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

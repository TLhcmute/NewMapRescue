import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Menu, ShieldQuestion } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const dropdownRef = useRef<HTMLDivElement>(null); //ref cho vùng dropdown

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setInfoOpen(false);
        setSuggestOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActivePath = (path: string) => location.pathname === path;

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const dropDownInfo = async () => {
    setSuggestOpen(false);
    setInfoOpen(!infoOpen);
    try {
      const response = await fetch(
        "https://byteforce.caohoangphuc.id.vn/python/api/rescuer/get_rescuer_info",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.idToken }),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      console.log("User info:", data); // Debug: hiển thị dữ liệu nhận được
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const dropDownSuggest = async () => {
    setInfoOpen(false);
    setSuggestOpen(!suggestOpen);
    try {
      const response = await fetch(
        "https://byteforce.caohoangphuc.id.vn/python/api/get_recomment_action_rescuer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.idToken }),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.text();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
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
        <nav
          className="hidden md:flex items-center space-x-6"
          ref={dropdownRef}
        >
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
            AI Assistant
          </button>
          <button
            onClick={() => navigateTo("/groupChat")}
            className={`nav-item ${
              isActivePath("/groupChat") ? "nav-item-active" : ""
            }`}
          >
            Chat Team
          </button>
          <button
            onClick={() => navigateTo("/dashboard")}
            className={`nav-item ${
              isActivePath("/dashboard") ? "nav-item-active" : ""
            }`}
          >
            Dashboard
          </button>

          {user.isAuthenticated && (
            <div className="ml-6 flex items-center space-x-4">
              {/* User info dropdown */}
              <button
                onClick={dropDownInfo}
                className={`"flex items-center px-4 py-2 bg-gray-100 rounded-full text-base font-medium hover:bg-gray-200" ${
                  infoOpen ? "text-[#d32f2f]" : ""
                }`}
              >
                {user.username}
              </button>
              {infoOpen && (
                <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-md p-4 border text-sm text-gray-700 z-10">
                  <p className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md transition duration-200">
                    <span className="font-semibold text-gray-800">Tên:</span>
                    <span>{userInfo?.name}</span>
                  </p>
                  <p className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md transition duration-200">
                    <span className="font-semibold text-gray-800">Tuổi:</span>
                    <span>{userInfo?.age}</span>
                  </p>
                  <p className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md transition duration-200">
                    <span className="font-semibold text-gray-800">
                      Số điện thoại:
                    </span>
                    <span>{userInfo?.phone}</span>
                  </p>
                  <p className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md transition duration-200">
                    <span className="font-semibold text-gray-800">
                      Phương tiện:
                    </span>
                    <span>{userInfo?.vehicle}</span>
                  </p>
                  <p className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md transition duration-200">
                    <span className="font-semibold text-gray-800">
                      Kĩ năng:
                    </span>
                    <span>{userInfo?.skill}</span>
                  </p>
                </div>
              )}

              {/* Suggestion dropdown */}
              <button
                onClick={dropDownSuggest}
                className={`flex items-center px-4 py-2 bg-gray-100 rounded-full text-base font-medium hover:bg-gray-200 ${
                  suggestOpen ? "text-[#d32f2f]" : ""
                }`}
              >
                <ShieldQuestion /> Gợi ý
              </button>
              {suggestOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-md p-4 border text-sm text-gray-700 z-10">
                  {suggestions?.trim() ? (
                    <p className="text-gray-800">
                      <span className="font-bold">Gợi ý:</span> {suggestions}
                    </p>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Đang lấy gợi ý....{" "}
                    </div>
                  )}
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

      {/* ...Mobile menu code không đổi... */}
    </header>
  );
};

export default Header;

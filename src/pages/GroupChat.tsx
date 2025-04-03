import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook
import ChatArea from "@/components/ChatArea";
const GroupChat = () => {
  // Lấy thông tin người dùng từ AuthContext
  const { user } = useAuth(); // `user` chứa thông tin người dùng
  // user={user}
  return (
    <>
      <div>
        {/* Truyền đối tượng user vào Header component */}
        <Header />
        <div className="flex h-screen overflow-hidden bg-background">
          <ChatArea currentUser={user} />
        </div>
      </div>
    </>
  );
};

export default GroupChat;

import React from "react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook

const GroupChat = () => {
  // Lấy thông tin người dùng từ AuthContext
  const { user } = useAuth(); // `user` chứa thông tin người dùng

  return (
    <>
      <div>
        {/* Truyền đối tượng user vào Header component */}
        <Header user={user} />
      </div>
    </>
  );
};

export default GroupChat;

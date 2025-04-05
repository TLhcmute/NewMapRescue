import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import io from "socket.io-client";
import { useGeolocated } from "react-geolocated";

const socket = io("https://chiquoc26.id.vn");

interface MessageType {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
}

interface UserType {
  id: string;
  name: string;
}

const ChatArea = ({ currentUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<MessageType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLong, setLocationLong] = useState<number | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://chiquoc26.id.vn/api/chats/");
        const data = await response.json();

        // Giả sử data là một mảng như bạn đã cung cấp
        const messages = data.map((item) => item.receiveMessage);
        const users = data.map((item) => item.receiveUser);

        setChatMessages(messages);
        setUsers(users);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const handleMessage = (data) => {
      const { receiveMessage, receiveUser } = data;
      if (receiveMessage && receiveUser) {
        setChatMessages((prev) => [...prev, receiveMessage]);
        setUsers((prev) => [...prev, receiveUser]);
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: MessageType = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      text: newMessage,
      timestamp: new Date(),
    };

    const formData = {
      receiveMessage: message,
      receiveUser: currentUser,
    };
    console.log(formData);
    socket.emit("message", formData);
    setNewMessage("");
  };

  const getUserById = (userId: string): UserType => {
    return users.find((user) => user.id === userId) || currentUser;
  };

  const groupMessagesByDate = useMemo(() => {
    const groups: { date: string; messages: MessageType[] }[] = [];

    chatMessages.forEach((message) => {
      if (!message || !message.timestamp) return;

      // Chuyển đổi timestamp thành đối tượng Date nếu cần
      const messageDate = new Date(message.timestamp);

      // Kiểm tra xem messageDate có phải là một đối tượng Date hợp lệ
      if (isNaN(messageDate.getTime())) {
        console.error("Invalid timestamp:", message.timestamp);
        return;
      }

      const dateString = messageDate.toDateString();
      const existingGroup = groups.find((group) => group.date === dateString);

      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({
          date: dateString,
          messages: [message],
        });
      }
    });

    return groups;
  }, [chatMessages]);

  // Hàm chuyển tọa độ thành địa chỉ cụ thể
  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      return data.display_name || `${lat}, ${lon}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `${lat}, ${lon}`;
    }
  };

  // Hàm xử lý khi bấm nút "Gửi vị trí"
  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        setLocationLat(lat);
        setLocationLong(long);

        const address = await reverseGeocode(lat, long);
        const locationMessage = `📍 Vị trí của tôi: ${address} (Lat: ${lat}, Long: ${long})`;
        setNewMessage(locationMessage);
      },
      (error) => {
        console.error("Lỗi khi lấy vị trí:", error);
        alert("Không thể lấy vị trí.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {groupMessagesByDate.map((group) => (
          <div key={group.date} className="mb-6">
            <div className="flex items-center my-4">
              <Separator className="flex-grow" />
              <span className="px-4 text-xs text-muted-foreground font-medium">
                {new Date().toDateString() === group.date
                  ? "Today"
                  : group.date}
              </span>
              <Separator className="flex-grow" />
            </div>
            {group.messages.map((message) => {
              const user = getUserById(message.userId);
              return (
                <div key={message.id} className="mb-4 last:mb-0">
                  <div className="flex items-baseline">
                    <span className="font-medium mr-2">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(message.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className={cn("bg-accent rounded-lg p-3")}>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="New message..."
            className="flex-1"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!newMessage.trim()}
          >
            <Send
              className={cn(
                "h-5 w-5",
                newMessage.trim() ? "text-primary" : "text-muted-foreground"
              )}
            />
          </Button>
          <Button onClick={handleSendLocation}>Gửi vị trí</Button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;

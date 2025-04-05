import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import {
  Send,
  MapPin,
  MessageSquare,
  Bot,
  X,
  HeartPulse,
  XCircle,
  Info,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import "react-toastify/dist/ReactToastify.css";

interface ChatMessage {
  sender: "User" | "AI";
  text: string;
  image?: string | null;
  timestamp: string;
}
interface Person {
  id: string;
  name: string;
  phone: string;
  location: [number, number];
  status: "Waiting" | "Accepted" | "Finished";
  priority: "high" | "low";
  image?: string;
  message?: string;
  address?: string;
}
const RescueBot: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [rescueList, setRescueList] = useState<Person[]>([]);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handlePostRequest = async (id: string) => {
    setLoading(true);
    setError(null);

    // Hiển thị thông báo "Đang tải"
    const toastId = toast.info("Đang tải dữ liệu, vui lòng chờ...", {
      position: "top-right",
      autoClose: false, // Thông báo không tự động đóng
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      className:
        "fixed top-10 right-10 bg-gradient-to-r from-white to-gray-100 text-gray-800 px-6 py-4 rounded-xl shadow-lg text-base font-sans font-medium transition-all ease-in-out duration-300 transform hover:scale-102 flex justify-center items-center text-center space-x-3 border border-gray-200 hover:bg-gray-50",
      progressClassName: "bg-gray-400 h-0.5 rounded-full",
      icon: false,
    });

    try {
      const response = await fetch("https://chiquoc26.id.vn/api/grokAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }), // Dữ liệu gửi đi
      });

      if (!response.ok) {
        throw new Error("Lỗi khi gửi yêu cầu");
      }

      const data = await response.json();

      // Đóng thông báo "Đang tải" sau khi nhận được phản hồi
      toast.dismiss(toastId);

      // Hiển thị thông báo gợi ý
      toast.info(
        ({ closeToast }) => (
          <div className="flex items-center space-x-3">
            <Info size={16} className="text-gray-700 flex-shrink-0" />
            <p className="font-medium">{data.message}</p>
          </div>
        ),
        {
          position: "top-right",
          autoClose: 50000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className:
            "fixed top-10 right-10 bg-gradient-to-r from-white to-gray-100 text-gray-800 px-6 py-4 rounded-xl shadow-lg text-base font-sans font-medium transition-all ease-in-out duration-300 transform hover:scale-102 flex justify-center items-center text-center space-x-3 border border-gray-200 hover:bg-gray-50",
          progressClassName: "bg-gray-400 h-0.5 rounded-full",
          icon: false,
        }
      );
    } catch (err) {
      setError(err.message); // Xử lý lỗi nếu có

      // Đóng thông báo "Đang tải" khi có lỗi
      toast.dismiss(toastId);

      // Thông báo lỗi
      toast.error(
        ({ closeToast }) => (
          <div className="flex items-center space-x-3">
            <XCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="font-medium">{err.message}</p>
          </div>
        ),
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className:
            "fixed top-10 right-10 bg-gradient-to-r from-white to-gray-100 text-gray-800 px-6 py-4 rounded-xl shadow-lg text-base font-sans font-medium transition-all ease-in-out duration-300 transform hover:scale-102 flex justify-center items-center text-center space-x-3 border border-gray-200 hover:bg-gray-50",
          progressClassName: "bg-red-400 h-0.5 rounded-full",
          icon: false,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRescueList = async () => {
      try {
        const response = await fetch(
          "https://byteforce.caohoangphuc.id.vn/python/api/get_all_request"
        );
        const data: Person[] = await response.json();
        setRescueList(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách cứu hộ:", error);
      }
    };
    fetchRescueList();
  }, []);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: "AI",
      text: `Chào,Tôi sẽ trả lời giải đáp các thông tin để hỗ trợ đội cứu hộ ( ví dụ: tư vấn về trường hợp đang cần cứu trợ, tư vấn tâm lý cho đội cứu hộ,...). Bạn cần tôi giúp gì không?`,
      image: null,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImage(file);
    }
  };
  const handleSupportRequest = async (personId: string, personName: string) => {
    try {
      const response = await fetch("https://chiquoc26.id.vn/api/grokAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: personId }),
      });

      if (!response.ok) {
        throw new Error("Gửi hỗ trợ thất bại");
      }
      const aiResponse: string = `Giờ đây tôi sẽ hỗ trợ bạn các thông tin về người dùng ${message}`;

      toast.success("Đã gửi hỗ trợ thành công");
      console;
    } catch (error) {
      console.error("Lỗi khi gửi hỗ trợ:", error);
      toast.error("Không thể gửi hỗ trợ");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    const userMessage: ChatMessage = {
      sender: "User",
      text: message || "",
      image: image ? URL.createObjectURL(image) : null,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const formData = new FormData();
      if (message) formData.append("message", message);
      if (image) formData.append("image", image);

      const response = await fetch(
        "https://byteforce.caohoangphuc.id.vn/python/api/get_grok_rsp",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const aiResponse = data;

      const aiMessage: ChatMessage = {
        sender: "AI",
        text: aiResponse,
        image: null,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI API:", error);
      toast.error("Failed to get response from AI");
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Sorry, something went wrong. Please try again.",
          image: null,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
      setMessage("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const [searchQuery, setSearchQuery] = useState(""); // State để lưu giá trị tìm kiếm

  // Hàm lọc danh sách dựa trên tìm kiếm
  const filteredRescueList = rescueList.filter(
    (person) => person.name.toLowerCase().includes(searchQuery.toLowerCase()) // Lọc theo tên
  );
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black flex items-center gap-2">
            <Bot className="w-6 h-6 text-black" />
            ByteRescue – RescueBot
          </h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-black hover:bg-gray-100"
              >
                <MessageSquare className="w-5 h-5" />
                Suggested Questions
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white border-l border-gray-200">
              <SheetHeader>
                <SheetTitle className="text-black">
                  Suggested Questions
                </SheetTitle>
                <SheetDescription className="text-gray-600">
                  Here are some questions you can ask the AI to assist with
                  rescue operations.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full text-left text-black hover:bg-gray-100"
                  onClick={() =>
                    setMessage(
                      "What should I do if someone is trapped in a flooded area?"
                    )
                  }
                >
                  What should I do if someone is trapped in a flooded area?
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left text-black hover:bg-gray-100"
                  onClick={() =>
                    setMessage("How can I prioritize rescue tasks?")
                  }
                >
                  How can I prioritize rescue tasks?
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left text-black hover:bg-gray-100"
                  onClick={() =>
                    setMessage("Can you analyze this image for me?")
                  }
                >
                  Can you analyze this image for me?
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-4xl mx-auto">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "User" ? "justify-end" : "justify-start"
                } mb-4 animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-lg transition-all duration-300 ${
                    msg.sender === "User"
                      ? "bg-white border border-gray-200 text-black"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {msg.sender === "User" ? (
                      <span className="font-medium text-black">
                        {user?.username || "You"}
                      </span>
                    ) : (
                      <span className="font-medium flex items-center gap-1 text-black">
                        <Bot className="w-5 h-5" /> ByteForce AI
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {msg.timestamp}
                    </span>
                  </div>
                  {msg.text && (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  )}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Chat content"
                      className="mt-2 max-w-full sm:max-w-[300px] rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => setShowImageModal(msg.image)}
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <form
            onSubmit={handleSendMessage}
            className="flex items-end gap-3 max-w-4xl mx-auto"
          >
            <div className="flex flex-col gap-2">
              {image && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 bg-gray-300 text-black rounded-full p-1 hover:bg-gray-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex gap-3">
                {/* Upload Image Button */}
                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <MapPin className="w-5 h-5 text-black" />
                  <span className="text-sm font-medium text-black">
                    Upload Image
                  </span>
                </label>

                {/* New Map Pin Button */}
              </div>
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-black placeholder-gray-500"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 text-black hover:bg-gray-100"
                >
                  Gợi Ý <Lightbulb />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="bg-white border-l border-gray-200 w-[320px] sm:w-[400px] px-4 py-6"
              >
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold text-black">
                    <Lightbulb /> Hint
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-600">
                    Cung cấp gợi ý cho từng trường hợp{" "}
                  </SheetDescription>
                </SheetHeader>

                {/* Tìm kiếm */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="mt-6 space-y-4 overflow-y-auto max-h-[75vh] pr-1 custom-scroll">
                  {filteredRescueList.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center">
                      Không có dữ liệu cứu hộ hiện tại.
                    </p>
                  ) : (
                    filteredRescueList.map((person) => (
                      <div
                        key={person.id}
                        className={`p-4 rounded-xl shadow-md border ${
                          person.priority === "high"
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-black text-sm">
                            {person.name}
                          </h4>

                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              person.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {person.priority === "high" ? "Khẩn cấp" : "Thường"}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Địa chỉ:</strong>{" "}
                          {person.address || "Chưa rõ"}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Trạng thái:</strong> {person.status}
                        </p>
                        {person.message && (
                          <p className="text-xs text-gray-500 italic">
                            “{person.message}”
                          </p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full text-black border-gray-300 hover:bg-gray-100 text-xs"
                          onClick={() => {
                            handlePostRequest(person.id);
                          }}
                        >
                          Hỗ trợ Tư Vấn
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-white border border-gray-200 text-black hover:bg-gray-100"
            >
              <Send className="w-5 h-5" />
              {loading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>

      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setShowImageModal(null)}
        >
          <img
            src={showImageModal}
            alt="Full size"
            className="max-w-[90%] max-h-[90%] rounded-lg"
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default RescueBot;

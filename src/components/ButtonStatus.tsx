import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader } from "lucide-react"; // Import các icon từ Lucide React
import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook

const StatusButton = () => {
  const { user } = useAuth(); // `user` chứa thông tin người dùng
  const [status, setStatus] = useState<string>("Sẵn Sàng"); // Set initial state to "Sẵn Sàng"

  // Đọc trạng thái từ localStorage khi component được mount
  useEffect(() => {
    const savedStatus = localStorage.getItem("status");
    if (savedStatus) {
      setStatus(savedStatus); // Nếu có trạng thái lưu trữ, lấy nó từ localStorage
    }
  }, []);

  // Hàm lấy vị trí của người dùng (dùng Geolocation API)
  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported"));
      }
    });
  };

  const handleClickButton = async () => {
    switch (status) {
      case "Sẵn Sàng":
        setStatus("Dừng làm việc"); // Chuyển sang trạng thái "Dừng làm việc"
        localStorage.setItem("status", "Dừng làm việc"); // Lưu trạng thái vào localStorage

        // Gửi trạng thái "READY" và vị trí người dùng lên backend
        try {
          const location = await getLocation(); // Lấy vị trí người dùng
          const response = await fetch(
            "https://byteforce.caohoangphuc.id.vn/python/api/rescuer/get_ready",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: user.idToken,
                status: "READY", // Cập nhật trạng thái "READY"
                location: [location.latitude, location.longitude], // Vị trí dưới dạng mảng 2 phần tử
              }),
            }
          );

          if (response.ok) {
            console.log("Successfully sent status to backend");
          } else {
            console.error("Failed to send status to backend");
          }
        } catch (error) {
          console.error("Error getting location or sending data:", error);
        }
        break;

      case "Dừng làm việc":
        setStatus("Sẵn Sàng"); // Chuyển lại trạng thái "Sẵn Sàng"
        localStorage.setItem("status", "Sẵn Sàng"); // Lưu trạng thái vào localStorage

        // Gửi trạng thái "NOT-READY" lên backend (không gửi vị trí)
        try {
          const response = await fetch(
            "https://byteforce.caohoangphuc.id.vn/python/api/rescuer/get_rest",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: user.idToken,
                status: "NOT-READY", // Cập nhật trạng thái "NOT-READY"
              }),
            }
          );

          if (response.ok) {
            console.log("Successfully sent status to backend");
          } else {
            console.error("Failed to send status to backend");
          }
        } catch (error) {
          console.error("Error sending data:", error);
        }
        break;

      default:
        setStatus("Sẵn Sàng"); // Mặc định quay lại trạng thái "Sẵn Sàng"
        localStorage.setItem("status", "Sẵn Sàng"); // Lưu trạng thái vào localStorage
        break;
    }
  };

  // ClassName và icon dựa trên trạng thái
  const buttonClass = () => {
    switch (status) {
      case "Sẵn Sàng":
        return "bg-green-500 text-white hover:bg-green-600 focus:ring-4 focus:ring-green-300";
      case "Dừng làm việc":
        return "bg-black text-white hover:bg-gray-700 focus:ring-4 focus:ring-gray-300";
      default:
        return "bg-black text-white hover:bg-gray-700 focus:ring-4 focus:ring-gray-300";
    }
  };

  // Chọn icon dựa trên trạng thái
  const renderIcon = () => {
    switch (status) {
      case "Sẵn Sàng":
        return <Loader className="mr-2 animate-spin" />; // Icon quay vòng cho trạng thái "Sẵn Sàng"
      case "Dừng làm việc":
        return <CheckCircle className="mr-2" />; // Icon check cho trạng thái "Dừng làm việc"
      default:
        return null;
    }
  };

  return (
    <Button
      onClick={handleClickButton}
      className={`${buttonClass()} py-2 px-4 rounded-lg transition-all duration-200 shadow-md`}
    >
      {renderIcon()}
      {status}
    </Button>
  );
};

export default StatusButton;

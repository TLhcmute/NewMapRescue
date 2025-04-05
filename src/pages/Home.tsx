import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { MapPin, MessageSquare } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[90vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white z-0">
            {/* Background image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529346378633-c2b2a059c367?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center text-center">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-rescue-primary bg-rescue-primary/10 rounded-full mb-4 animate-fade-in">
              EMERGENCY RESPONSE SYSTEM
            </span>

            <h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 max-w-4xl animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="text-rescue-primary">Rescue Map Hub</span>
            </h1>

            <p
              className="text-xl text-gray-600 mb-4 max-w-2xl animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Developed by ByteForce Team
            </p>

            <p
              className="text-gray-600 mb-10 max-w-2xl animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Cung cấp cho các đội cứu hộ công cụ thông minh tích hợp theo dõi
              vị trí và phối hợp theo thời gian thực để phản ứng nhanh hơn và
              cứu được nhiều mạng người hơn.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <button
                onClick={() => navigate("/map")}
                className="secondary-button flex items-center justify-center gap-2 min-w-[200px]"
              >
                <MapPin size={18} />
                Go to Rescue Map
              </button>

              <button
                onClick={() => navigate("/chat")}
                className="tertiary-button flex items-center justify-center gap-2 min-w-[200px]"
              >
                <MessageSquare size={18} />
                Tư vấn hỗ trợ
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Các tính năng chính
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nền tảng của chúng tôi cung cấp các công cụ thiết yếu để phối
                hợp ứng phó khẩn cấp hiệu quả.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-xl transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-rescue-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-rescue-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Trợ lý thông minh cho đội cứu hộ
                </h3>
                <p className="text-gray-600">
                  Cung cấp nhiều tính năng thông minh hỗ trợ người cứu hộ giúp
                  tăng tối đa thời gian cứu hộ .
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-rescue-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    className="text-rescue-secondary"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Thông tin thực </h3>
                <p className="text-gray-600">
                  Cung cấp thông tin thời gian thực về thời tiết cung cấp thông
                  tin nhanh nhất về tình trạng vị trí cần cứu hộ cho đội cứu hộ.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-rescue-tertiary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="text-rescue-tertiary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Giao tiếp nhóm</h3>
                <p className="text-gray-600">
                  Giao tiếp an toàn với các thành viên trong nhóm thông qua tin
                  nhắn tích hợp.Có thể cung cấp vị trí trực tiếp cho nhau.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Rescue Map Hub - ByteForce Team. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

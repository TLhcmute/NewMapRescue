
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full px-4 py-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100">
              <span className="text-6xl font-bold text-gray-300">404</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-6 py-3 bg-rescue-tertiary text-white rounded-full hover:bg-opacity-90 transition-all"
          >
            <ArrowLeft size={18} className="mr-2" />
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import React from "react";
import { Check, MapPin, X, Navigation } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

interface AcceptedRescuesProps {
  acceptedRescues: Person[];
  onClose: () => void;
  onComplete: (id: string) => void;
  onSelect: (person: Person) => void;
  calculateDistance: (location: [number, number]) => number;
}

const AcceptedRescues = ({
  acceptedRescues,
  onClose,
  onComplete,
  onSelect,
  calculateDistance,
}: AcceptedRescuesProps) => {
  const openGoogleMapsDirections = (location: [number, number]) => {
    const [lat, lng] = location;
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, "_blank");
  };

  // Lọc những yêu cầu cứu hộ có trạng thái là "Accepted"
  const acceptedPeople = acceptedRescues.filter(
    (person) => person.status === "Accepted"
  );

  if (acceptedPeople.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Yêu cầu cứu hộ đã nhận</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <MapPin size={48} className="mb-4 text-gray-400" />
            <p className="text-center">Bạn chưa nhận yêu cầu cứu hộ nào.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Yêu cầu cứu hộ đã nhận ({acceptedPeople.length})
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {acceptedPeople.map((person) => (
            <div key={person.id} className="border rounded-lg p-3 bg-white">
              <div className="flex items-center gap-3 mb-2">
                {person.image ? (
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                )}

                <div className="flex-1">
                  <h4 className="font-medium">{person.name}</h4>
                  <p className="text-sm text-gray-500">{person.phone}</p>
                </div>

                <div className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Đã nhận
                </div>
              </div>

              {person.address && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Địa chỉ:</span> {person.address}
                </div>
              )}

              {person.message && (
                <div className="text-sm italic bg-gray-50 p-2 rounded mb-2 text-gray-600">
                  "{person.message}"
                </div>
              )}

              <div className="text-sm text-gray-500 mb-3">
                <span className="font-medium">Khoảng cách:</span>{" "}
                {calculateDistance(person.location)} km
              </div>

              <div className="flex gap-2 flex-col">
                <button
                  className="w-full py-2 px-3 bg-blue-500 text-white rounded-md flex items-center justify-center space-x-1 text-sm hover:bg-blue-600 transition-colors"
                  onClick={() => onComplete(person.id)}
                >
                  <Check size={14} className="mr-1" />
                  <span>Hoàn thành</span>
                </button>

                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-md flex items-center justify-center space-x-1 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      onSelect(person);
                      onClose();
                    }}
                  >
                    <Navigation size={14} className="mr-1" />
                    <span>Xem trên bản đồ</span>
                  </button>

                  <button
                    className="flex-1 py-2 px-3 bg-green-500 text-white rounded-md flex items-center justify-center space-x-1 text-sm hover:bg-green-600 transition-colors"
                    onClick={() => openGoogleMapsDirections(person.location)}
                  >
                    <Navigation size={14} className="mr-1" />
                    <span>Google Maps</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcceptedRescues;

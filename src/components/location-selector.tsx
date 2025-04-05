import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Heart, Navigation, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationProps {
  id: string; // id của địa điểm
  name: string;
  address: string;
  location: [number, number]; // Địa điểm có format [vĩ độ, kinh độ]
  isFavorite?: boolean;
}

export function LocationSelector({
  selectedLocation,
  setSelectedLocation,
  setLocationData, // Hàm để truyền kinh độ, vĩ độ lên component cha
  setAddressData, // Hàm để truyền địa chỉ lên component cha
}: {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  setLocationData: (location: [number, number]) => void; // Hàm để truyền location lên component cha
  setAddressData: (address: string) => void; // Hàm để truyền địa chỉ lên component cha
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<LocationProps[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationProps[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Lấy dữ liệu từ API
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://byteforce.caohoangphuc.id.vn/python/api/get_all_request"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Data received:", data); // Debug: hiển thị dữ liệu nhận được

        // Kiểm tra cấu trúc dữ liệu và xử lý phù hợp
        let locationsData = [];

        if (Array.isArray(data)) {
          locationsData = data.map((item: any) => {
            console.log("Processing item:", item); // Debug: hiển thị từng item
            return {
              id: item.id || String(Math.random()), // Fallback nếu không có id
              name: item.name || "Địa điểm không tên",
              address: item.address || "Không có địa chỉ",
              location: item.location || [0, 0], // Đảm bảo có location
              isFavorite: false,
            };
          });
        } else if (data && typeof data === "object") {
          // Trường hợp API trả về object thay vì array
          if (data.data && Array.isArray(data.data)) {
            locationsData = data.data.map((item: any) => ({
              id: item.id || String(Math.random()),
              name: item.name || "Địa điểm không tên",
              address: item.address || "Không có địa chỉ",
              location: item.location || [0, 0],
              isFavorite: false,
            }));
          }
        }

        console.log("Processed locations:", locationsData); // Debug: hiển thị dữ liệu đã xử lý

        // Thêm một số dữ liệu mẫu trong trường hợp API không trả về dữ liệu
        if (locationsData.length === 0) {
          locationsData = [
            {
              id: "1",
              name: "Trường Đại học Bách Khoa",
              address: "268 Lý Thường Kiệt, P.14, Q.10, TP.HCM",
              location: [10.773, 106.659],
              isFavorite: false,
            },
            {
              id: "2",
              name: "Trường Đại học Khoa học Tự nhiên",
              address: "227 Nguyễn Văn Cừ, P.4, Q.5, TP.HCM",
              location: [10.762, 106.682],
              isFavorite: false,
            },
            {
              id: "3",
              name: "Trường Đại học Kinh tế TP.HCM",
              address: "59C Nguyễn Đình Chiểu, P.6, Q.3, TP.HCM",
              location: [10.779, 106.698],
              isFavorite: false,
            },
          ];
        }

        setLocations(locationsData);
        setFilteredLocations(locationsData);
      } catch (error) {
        console.error("Error fetching locations:", error);

        // Dữ liệu mẫu trong trường hợp lỗi
        const sampleLocations = [
          {
            id: "1",
            name: "Trường Đại học Bách Khoa",
            address: "268 Lý Thường Kiệt, P.14, Q.10, TP.HCM",
            location: [10.773, 106.659],
            isFavorite: false,
          },
          {
            id: "2",
            name: "Trường Đại học Khoa học Tự nhiên",
            address: "227 Nguyễn Văn Cừ, P.4, Q.5, TP.HCM",
            location: [10.762, 106.682],
            isFavorite: false,
          },
          {
            id: "3",
            name: "Trường Đại học Kinh tế TP.HCM",
            address: "59C Nguyễn Đình Chiểu, P.6, Q.3, TP.HCM",
            location: [10.779, 106.698],
            isFavorite: false,
          },
        ];

        setLocations(sampleLocations);
        setFilteredLocations(sampleLocations);
      }
    };

    fetchLocations();
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);

  const handleUseCurrentLocation = () => {
    console.log("Getting current location");
    setSelectedLocation("Vị trí hiện tại");
    setIsOpen(false);
  };

  const handleSelectLocation = (
    id: string,
    name: string,
    location: [number, number],
    address: string
  ) => {
    // Truyền location (kinh độ và vĩ độ) lên component cha
    setLocationData(location);
    setAddressData(address); // Truyền address lên component cha
    setSelectedLocation(name); // Cập nhật tên địa điểm
    setIsOpen(false); // Đóng menu sau khi chọn
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MapPin className="w-4 h-4" />
        <span>{selectedLocation}</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 w-72 z-50 p-2 shadow-lg">
          {/* Phần tìm kiếm */}
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm địa điểm..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="text-xs font-medium text-muted-foreground py-1 px-2">
            Địa điểm cần cứu hộ
          </div>

          {/* Thêm max-height và overflow-y-auto để có thể scroll */}
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {filteredLocations.map((location) => (
              <div
                key={location.id} // Dùng id làm key
                className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                onClick={() =>
                  handleSelectLocation(
                    location.id,
                    location.name,
                    location.location,
                    location.address
                  )
                } // Truyền vĩ độ, kinh độ, và address
              >
                <div>
                  <div className="font-medium">{location.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {location.address}
                  </div>
                </div>
                <Heart
                  className={`w-4 h-4 ${
                    location.isFavorite
                      ? "fill-rose-500 text-rose-500"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
            ))}

            {filteredLocations.length === 0 && (
              <div className="p-2 text-center text-sm text-muted-foreground">
                Không tìm thấy địa điểm nào
              </div>
            )}
          </div>

          {/* Thêm nút sử dụng vị trí hiện tại */}
          <div className="border-t mt-2 pt-2"></div>
        </Card>
      )}
    </div>
  );
}

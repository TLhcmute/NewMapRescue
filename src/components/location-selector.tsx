import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Heart, Navigation } from "lucide-react";

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

  useEffect(() => {
    // Lấy dữ liệu từ API
    const fetchLocations = async () => {
      try {
        const response = await fetch("https://chiquoc26.id.vn/api/list");
        const data = await response.json();

        // Chuyển đổi dữ liệu thành các đối tượng mà bạn cần
        const locationsData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          address: item.address,
          location: item.location, // location là mảng [vĩ độ, kinh độ]
          isFavorite: false, // Thêm logic nếu cần
        }));

        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching locations", error);
      }
    };

    fetchLocations();
  }, []);

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
        <Card className="absolute top-full mt-2 w-64 z-50 p-2 shadow-lg">
          <div className="text-xs font-medium text-muted-foreground py-1 px-2">
            Địa điểm cần cứu hộ
          </div>

          <div className="space-y-1">
            {locations.map((location) => (
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
          </div>
        </Card>
      )}
    </div>
  );
}

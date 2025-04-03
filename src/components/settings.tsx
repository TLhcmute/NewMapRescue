
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SettingsProps {
  temperatureUnit: 'c' | 'f';
  setTemperatureUnit: (unit: 'c' | 'f') => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
}

export function Settings({
  temperatureUnit,
  setTemperatureUnit,
  notifications,
  setNotifications
}: SettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cài đặt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Đơn vị đo nhiệt độ</h3>
          <RadioGroup
            value={temperatureUnit}
            onValueChange={(value) => setTemperatureUnit(value as 'c' | 'f')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="c" id="celsius" />
              <Label htmlFor="celsius">Celsius (°C)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="f" id="fahrenheit" />
              <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Thông báo</Label>
            <div className="text-sm text-muted-foreground">
              Nhận thông báo về thay đổi thời tiết và cảnh báo
            </div>
          </div>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-refresh">Tự động làm mới</Label>
            <div className="text-sm text-muted-foreground">
              Tự động cập nhật dữ liệu thời tiết mỗi 30 phút
            </div>
          </div>
          <Switch
            id="auto-refresh"
            defaultChecked={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}

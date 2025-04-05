import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ChartData {
  time: string;
  temperature: number;
  humidity?: number;
  precipitation?: number;
}

interface WeatherChartProps {
  hourlyData: ChartData[];
  unit: "c" | "f";
}

export function WeatherChart({ hourlyData, unit }: WeatherChartProps) {
  const [dataType, setDataType] = useState<
    "temperature" | "humidity" | "precipitation"
  >("temperature");

  const renderChart = () => {
    let color;
    let yAxisLabel;

    switch (dataType) {
      case "temperature":
        color = "#3498db";
        yAxisLabel = `Nhiệt độ (°${unit.toUpperCase()})`;
        break;
      case "humidity":
        color = "#2ecc71";
        yAxisLabel = "Độ ẩm (%)";
        break;
      case "precipitation":
        color = "#9b59b6";
        yAxisLabel = "Lượng mưa (mm)";
        break;
    }

    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={hourlyData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            opacity={0.5}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
            tickLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
            tickLine={{ stroke: "var(--border)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--card-foreground)",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataType}
            stroke={color}
            strokeWidth={2}
            dot={{ stroke: color, strokeWidth: 2, fill: "var(--card)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Biểu đồ thời tiết</span>
          <ToggleGroup
            type="single"
            value={dataType}
            onValueChange={(value: any) => value && setDataType(value)}
          >
            <ToggleGroupItem value="temperature" aria-label="Nhiệt độ">
              Nhiệt độ
            </ToggleGroupItem>
            <ToggleGroupItem value="humidity" aria-label="Độ ẩm">
              Độ ẩm
            </ToggleGroupItem>
            <ToggleGroupItem value="precipitation" aria-label="Lượng mưa">
              Lượng mưa
            </ToggleGroupItem>
          </ToggleGroup>
        </CardTitle>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}

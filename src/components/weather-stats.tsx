
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface WeatherStatsProps {
  monthlyData: {
    month: string;
    rainfall: number;
    avgTemperature: number;
  }[];
  unit: 'c' | 'f';
}

export function WeatherStats({ monthlyData, unit }: WeatherStatsProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Thống kê thời tiết</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Lượng mưa theo tháng (mm)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
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
                    color: "var(--card-foreground)"
                  }} 
                />
                <Bar dataKey="rainfall" fill="#3498db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Nhiệt độ trung bình theo tháng (°{unit.toUpperCase()})</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
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
                    color: "var(--card-foreground)"
                  }} 
                />
                <Bar dataKey="avgTemperature" fill="#f39c12" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CloudSun,
  Map,
  BarChart,
  Settings,
  Search,
  Home,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface SidebarLinkProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-2 mb-1 ${
        active ? "bg-primary/10 text-primary font-medium" : "hover:bg-primary/5"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Button>
  );
};

export function WeatherSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false); // State for collapse/expand

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  return (
    <Sidebar className="fixed top-0 left-0 z-10 h-full">
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <CloudSun className="h-6 w-6 text-primary" />
          <span
            className={`text-lg font-semibold ${isCollapsed ? "hidden" : ""}`}
          >
            ByteForce
          </span>
        </div>
        <div className="ml-auto flex items-center">
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)} // Toggle collapse state
            className="p-1"
          >
            {isCollapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </Button>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      {/* Conditional rendering of search and content when sidebar is expanded */}
      <div className={`px-4 py-2 ${isCollapsed ? "hidden" : ""}`}>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm thành phố..."
              className="pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <SidebarContent className="px-4 py-2">
          <div className="mb-6 space-y-1">
            <SidebarLink
              icon={Home}
              label="Trang Chủ"
              active={activeTab === "home"}
              onClick={() => setActiveTab("home")}
            />
            <SidebarLink
              icon={CloudSun}
              label="Dự Báo"
              active={activeTab === "forecast"}
              onClick={() => setActiveTab("forecast")}
            />
            <SidebarLink
              icon={Map}
              label="Bản Đồ"
              active={activeTab === "map"}
              onClick={() => setActiveTab("map")}
            />
            <SidebarLink
              icon={BarChart}
              label="Thống Kê"
              active={activeTab === "stats"}
              onClick={() => setActiveTab("stats")}
            />
            <SidebarLink
              icon={Settings}
              label="Cài Đặt"
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </div>
        </SidebarContent>
      </div>

      {/* Footer section */}
      <SidebarFooter className="p-4 border-t">
        <div className="flex justify-between items-center">
          <span
            className={`text-sm text-muted-foreground ${
              isCollapsed ? "hidden" : ""
            }`}
          ></span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

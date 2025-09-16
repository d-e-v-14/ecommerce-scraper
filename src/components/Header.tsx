import { Search, Bell, Settings, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export function Header({ activeTab, onNavigate }: HeaderProps) {
  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "listings", label: "Product Listings" },
    { key: "ocr", label: "OCR Analyzer" },
    { key: "rules", label: "Rule Engine" },
    { key: "reports", label: "Reports" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          {/* Logo / Title */}
          <h1 className="text-2xl font-nunito font-bold tracking-tight text-[color:var(--primary)] hover:opacity-90 transition-colors">
            Satya Suchak
          </h1>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onNavigate(tab.key)}
                className={`relative font-medium transition-all duration-200 pb-1 ${
                  activeTab === tab.key
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute left-0 -bottom-0.5 h-0.5 w-full rounded-full bg-[color:var(--primary)]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              className="pl-10 w-72 bg-muted/30 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] transition-all"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-muted transition-colors"
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full bg-[color:var(--primary)] text-white shadow-md">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted transition-colors"
            onClick={() => onNavigate("settings")}
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Profile */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted transition-colors"
            onClick={() => onNavigate("profile")}
          >
              <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

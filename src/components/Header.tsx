import { Search, Bell, Settings, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export function Header({ activeTab, onNavigate }: HeaderProps) {
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl tracking-tight text-[color:var(--primary)]">Legal Metrology</h1>
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => onNavigate("dashboard")}
              className={`transition-colors ${
                activeTab === "dashboard" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate("products")}
              className={`transition-colors ${
                activeTab === "products" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Products
            </button>
            <button 
              onClick={() => onNavigate("listings")}
              className={`transition-colors ${
                activeTab === "listings" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Product Listings
            </button>
            <button 
              onClick={() => onNavigate("ocr")}
              className={`transition-colors ${
                activeTab === "ocr" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              OCR Analyzer
            </button>
            <button 
              onClick={() => onNavigate("rules")}
              className={`transition-colors ${
                activeTab === "rules" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Rule Engine
            </button>
            <button 
              onClick={() => onNavigate("reports")}
              className={`transition-colors ${
                activeTab === "reports" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Reports
            </button>
            <button 
              onClick={() => onNavigate("profile")}
              className={`transition-colors ${
                activeTab === "profile" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Profile
            </button>
            <button 
              onClick={() => onNavigate("settings")}
              className={`transition-colors ${
                activeTab === "settings" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 w-64 bg-input-background border-0"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
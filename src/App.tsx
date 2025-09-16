import { useState } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { Products } from "./components/Products";
import { Reports } from "./components/Reports";
import { Profile } from "./components/Profile";
import { Settings } from "./components/Settings";
import { ProductListings } from "./components/ProductListings";
import { OcrAnalyzer } from "./components/OcrAnalyzer";
import { RuleEngine } from "./components/RuleEngine";
import { Login } from "./components/Login";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const renderContent = () => {
    if (!user) return <Login onLogin={setUser} />;
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "listings":
        return <ProductListings />;
      case "ocr":
        return <OcrAnalyzer />;
      case "rules":
        return <RuleEngine />;
      case "reports":
        return <Reports />;
      case "profile":
        return <Profile />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {user && (
        <Header activeTab={activeTab} onNavigate={setActiveTab} />
      )}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}
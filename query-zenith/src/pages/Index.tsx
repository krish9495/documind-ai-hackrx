import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { UploadSection } from "@/components/UploadSection";
import { QueryInterface } from "@/components/QueryInterface";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  
  // Mock user data - in real app this would come from authentication
  const mockUser = {
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard user={mockUser} />;
      case "upload":
        return <UploadSection />;
      case "query":
        return <QueryInterface />;
      case "results":
        return <div className="text-center py-12"><h2 className="text-2xl gradient-text">Results coming soon...</h2></div>;
      case "analytics":
        return <div className="text-center py-12"><h2 className="text-2xl gradient-text">Analytics coming soon...</h2></div>;
      default:
        return <Dashboard user={mockUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} onSignOut={() => console.log("Sign out")} />
      
      <div className="flex">
        <Navigation 
          activeItem={activeSection} 
          onItemClick={setActiveSection} 
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

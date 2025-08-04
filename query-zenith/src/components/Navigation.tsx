import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Upload, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Settings,
  HelpCircle
} from "lucide-react";

interface NavigationProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "query", label: "Query", icon: MessageSquare },
  { id: "results", label: "Results", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const secondaryItems = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
];

export const Navigation = ({ activeItem = "dashboard", onItemClick }: NavigationProps) => {
  return (
    <nav className="w-64 h-full glass-card border-r">
      <div className="p-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-11 px-4 transition-all",
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onItemClick?.(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="space-y-2">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start h-11 px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  onClick={() => onItemClick?.(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
          <h4 className="text-sm font-semibold text-primary mb-2">Upgrade to Pro</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Get unlimited queries and advanced analytics
          </p>
          <Button size="sm" className="w-full btn-gradient">
            Upgrade Now
          </Button>
        </div>
      </div>
    </nav>
  );
};
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Clock,
  FileText,
  Users,
  TrendingUp,
  Upload,
  MessageSquare,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { apiService, SystemHealth, formatUptime } from "@/lib/api";
import { toast } from "sonner";
import heroImage from "@/assets/hero-dashboard.jpg";

interface DashboardProps {
  user?: {
    name: string;
    email: string;
  };
}

export const Dashboard = ({ user }: DashboardProps) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSystemHealth = async () => {
    try {
      setLoading(true);
      const health = await apiService.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      toast.error("Failed to fetch system health");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStats = () => {
    if (!systemHealth) {
      return [
        {
          title: "Active Sessions",
          value: "Loading...",
          change: "",
          icon: Activity,
          color: "text-accent",
        },
        {
          title: "Total Requests",
          value: "Loading...",
          change: "",
          icon: MessageSquare,
          color: "text-primary",
        },
        {
          title: "Response Time",
          value: "Loading...",
          change: "",
          icon: Clock,
          color: "text-accent",
        },
        {
          title: "System Status",
          value: "Loading...",
          change: "",
          icon: FileText,
          color: "text-muted-foreground",
        },
      ];
    }

    return [
      {
        title: "Active Sessions",
        value: systemHealth.active_sessions.toString(),
        change: systemHealth.active_sessions > 0 ? "+Active" : "Idle",
        icon: Activity,
        color: "text-accent",
      },
      {
        title: "Total Requests",
        value: systemHealth.total_requests.toLocaleString(),
        change: "+All time",
        icon: MessageSquare,
        color: "text-primary",
      },
      {
        title: "Response Time",
        value: `${systemHealth.average_response_time.toFixed(0)}ms`,
        change: systemHealth.average_response_time < 1000 ? "Fast" : "Normal",
        icon: Clock,
        color: "text-accent",
      },
      {
        title: "System Status",
        value: systemHealth.status,
        change: `Up ${formatUptime(systemHealth.uptime)}`,
        icon: FileText,
        color:
          systemHealth.status === "healthy"
            ? "text-green-500"
            : "text-yellow-500",
      },
    ];
  };

  const stats = getStats();

  const quickActions = [
    {
      title: "Upload Documents",
      description: "Add new documents to your knowledge base",
      icon: Upload,
      action: "upload",
    },
    {
      title: "Start Query",
      description: "Ask questions about your documents",
      icon: MessageSquare,
      action: "query",
    },
    {
      title: "View Analytics",
      description: "Analyze your usage patterns",
      icon: BarChart3,
      action: "analytics",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl glass-card border">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back,{" "}
              <span className="gradient-text">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Your AI-powered document intelligence platform is ready. Start
              querying your knowledge base or upload new documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-gradient">
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-muted/50"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Querying
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">System Overview</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSystemHealth}
            disabled={loading}
            className="border-border hover:bg-muted/50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="glass-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      {systemHealth && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>{systemHealth.memory_usage.cpu_percent.toFixed(1)}%</span>
              </div>
              <Progress
                value={systemHealth.memory_usage.cpu_percent}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>{systemHealth.memory_usage.rss.toFixed(1)} MB</span>
              </div>
              <Progress
                value={Math.min(
                  (systemHealth.memory_usage.rss / 1000) * 100,
                  100
                )}
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatUptime(systemHealth.uptime)}
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {systemHealth.total_requests}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Requests
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              className="glass-card hover:scale-105 transition-all cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Response Time</span>
                <span className="text-accent">Excellent</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Query Accuracy</span>
                <span className="text-accent">High</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Document Processing</span>
                <span className="text-primary">Active</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Usage Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Queries today
                </span>
                <span className="text-2xl font-bold">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Documents processed
                </span>
                <span className="text-2xl font-bold">43</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Average confidence
                </span>
                <span className="text-2xl font-bold text-accent">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

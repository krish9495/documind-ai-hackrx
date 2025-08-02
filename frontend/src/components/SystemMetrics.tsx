import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Speed,
  Memory,
  People,
  QueryStats,
  TrendingUp,
  Computer,
} from "@mui/icons-material";
import { SystemMetricsProps } from "../types";

const SystemMetrics: React.FC<SystemMetricsProps> = ({ health }) => {
  const formatBytes = (bytes: number): string => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatUptime = (uptime: number): string => {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getLoadColor = (load: number): string => {
    if (load < 50) return "success";
    if (load < 80) return "warning";
    return "error";
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return <Computer color="success" />;
      case "degraded":
        return <Computer color="warning" />;
      case "unhealthy":
        return <Computer color="error" />;
      default:
        return <Computer />;
    }
  };

  if (!health) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Metrics
          </Typography>
          <Typography color="text.secondary">
            Loading system metrics...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              {getStatusIcon(health.status)}
              <Typography variant="h6" sx={{ mt: 1 }}>
                {health.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System Status
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <People color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                {health.active_sessions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <QueryStats color="secondary" sx={{ fontSize: 32 }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                {health.total_requests.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <Speed color="info" sx={{ fontSize: 32 }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                {health.average_response_time.toFixed(0)}ms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Response Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Metrics
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography variant="body2">CPU Usage</Typography>
              <Typography variant="body2" color="text.secondary">
                {health.memory_usage.cpu_percent.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={health.memory_usage.cpu_percent}
              color={getLoadColor(health.memory_usage.cpu_percent) as any}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography variant="body2">Memory Usage</Typography>
              <Typography variant="body2" color="text.secondary">
                {health.memory_usage.rss.toFixed(1)} MB
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min((health.memory_usage.rss / 1000) * 100, 100)}
              color={
                getLoadColor(
                  Math.min((health.memory_usage.rss / 1000) * 100, 100)
                ) as any
              }
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Detailed Statistics Table */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Statistics
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Response Time (Avg)</TableCell>
                  <TableCell align="right">
                    {health.average_response_time.toFixed(0)}ms
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={
                        health.average_response_time < 2000 ? "Good" : "Slow"
                      }
                      color={
                        health.average_response_time < 2000
                          ? "success"
                          : "warning"
                      }
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Active Sessions</TableCell>
                  <TableCell align="right">{health.active_sessions}</TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={health.active_sessions > 0 ? "Active" : "Idle"}
                      color={health.active_sessions > 0 ? "success" : "default"}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Total Requests</TableCell>
                  <TableCell align="right">
                    {health.total_requests.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <Chip size="small" label="Active" color="success" />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>CPU Usage</TableCell>
                  <TableCell align="right">
                    {health.memory_usage.cpu_percent.toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={
                        health.memory_usage.cpu_percent < 80 ? "Normal" : "High"
                      }
                      color={
                        getLoadColor(health.memory_usage.cpu_percent) as any
                      }
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Memory Usage</TableCell>
                  <TableCell align="right">
                    {health.memory_usage.rss.toFixed(1)} MB
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={health.memory_usage.rss < 500 ? "Normal" : "High"}
                      color={
                        getLoadColor(
                          Math.min((health.memory_usage.rss / 500) * 100, 100)
                        ) as any
                      }
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Uptime</TableCell>
                  <TableCell align="right">
                    {formatUptime(health.uptime)}
                  </TableCell>
                  <TableCell align="right">
                    <Chip size="small" label="Running" color="success" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SystemMetrics;

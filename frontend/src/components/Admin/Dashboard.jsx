import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  IconButton,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  Work,
  TrendingUp,
  Assignment,
  Settings,
  Notifications,
  ExitToApp,
  School,
  Business,
  Analytics,
  PersonAdd,
  WorkOutline,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { getAdminDashboardStats } from "../../api/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DRAWER_WIDTH = 260;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 125,
    totalInternships: 45,
    filledPositions: 32,
    pendingApplications: 28,
    successfulMatches: 89,
    averageMatchScore: 85.2,
  });
  const [recentActivities] = useState([
    { id: 1, student: "Alice Johnson", internship: "Software Dev at TechCorp", status: "matched", time: "2 hours ago" },
    { id: 2, student: "Bob Smith", internship: "Data Science at DataLab", status: "pending", time: "4 hours ago" },
    { id: 3, student: "Carol Davis", internship: "UX Design at DesignStudio", status: "matched", time: "6 hours ago" },
    { id: 4, student: "David Wilson", internship: "Marketing at BrandCo", status: "reviewing", time: "1 day ago" },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getAdminDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, active: true },
    { text: "Students", icon: <People /> },
    { text: "Internships", icon: <Work /> },
    { text: "Matching Portal", icon: <Assignment /> },
    { text: "Analytics", icon: <Analytics /> },
    { text: "Settings", icon: <Settings /> },
  ];

  const chartData = {
    labels: ["Total Internships", "Filled Positions", "Available"],
    datasets: [
      {
        label: "Internship Status",
        data: [stats.totalInternships, stats.filledPositions, stats.totalInternships - stats.filledPositions],
        backgroundColor: ["#1976d2", "#4caf50", "#ff9800"],
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ["Matched", "Pending", "Under Review"],
    datasets: [
      {
        data: [stats.successfulMatches, stats.pendingApplications, 15],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Successful Matches",
        data: [12, 19, 15, 25, 22, 30],
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            background: "linear-gradient(145deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Typography variant="h6" fontWeight="bold">
            Smart Allocation
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Admin Portal
          </Typography>
        </Box>
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 2,
                bgcolor: item.active ? "rgba(255,255,255,0.1)" : "transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ mt: "auto", p: 2 }}>
          <Button
            startIcon={<ExitToApp />}
            onClick={handleLogout}
            fullWidth
            sx={{ color: "white", justifyContent: "flex-start" }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your internship program.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                    <People />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalStudents}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Students
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                    <Work />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalInternships}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Internships
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.successfulMatches}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Successful Matches
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.averageMatchScore}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Avg Match Score
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts and Tables */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Internship Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Matching Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={lineData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Application Status
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <Box>
                  {recentActivities.map((activity) => (
                    <Box
                      key={activity.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 2,
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                        {activity.student.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {activity.student}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.internship}
                        </Typography>
                      </Box>
                      <Chip
                        label={activity.status}
                        size="small"
                        color={
                          activity.status === "matched"
                            ? "success"
                            : activity.status === "pending"
                            ? "warning"
                            : "default"
                        }
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;

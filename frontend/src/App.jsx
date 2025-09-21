import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Register from "./components/Auth/Register.jsx";
import StudentDashboard from "./components/Student/StudentDashboard.jsx";
import AdminDashboard from "./components/Admin/Dashboard.jsx";
import MatchingPortal from "./components/Admin/MatchingPortal.jsx";
import Internships from "./components/Admin/Internships.jsx";
import Students from "./components/Admin/Students.jsx";
import Settings from "./components/Admin/Settings.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";
import Login from "./components/Auth/Auth.jsx";

// Create a modern theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/register"
            element={
              <Register
                onRegisterSuccess={(role) => {
                  localStorage.setItem("role", role);
                  window.location.href =
                    role === "admin" ? "/admin/dashboard" : "/student/dashboard";
                }}
              />
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          
          {/* Admin Routes with Layout */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/internships"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Internships />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/matching"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <MatchingPortal />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Students />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

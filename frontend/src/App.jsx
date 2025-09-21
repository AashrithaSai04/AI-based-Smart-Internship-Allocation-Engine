function Login() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    role: "student",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("role", formData.role);
    window.location.href =
      formData.role === "admin" ? "/admin/dashboard" : "/student/dashboard";
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        overflow: "auto",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: 400,
          mx: 2,
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h5" mb={2} align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <RadioGroup
              row
              name="role"
              value={formData.role}
              onChange={handleChange}
              sx={{ mb: 1 }}
            >
              <FormControlLabel
                value="student"
                control={<Radio />}
                label="Student"
              />
              <FormControlLabel
                value="admin"
                control={<Radio />}
                label="Admin"
              />
            </RadioGroup>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Login
            </Button>
          </Stack>
        </form>
        <Button href="/register" color="secondary" fullWidth sx={{ mt: 2 }}>
          New user? Register
        </Button>
      </Paper>
    </Box>
  );
}

function App() {
  return (
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
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/matching"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <MatchingPortal />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Auth/Register.jsx";
import StudentDashboard from "./components/Student/StudentDashboard.jsx";
import AdminDashboard from "./components/Admin/Dashboard.jsx";
import MatchingPortal from "./components/Admin/MatchingPortal.jsx";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";
import {
  Box,
  Button,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Stack,
} from "@mui/material";

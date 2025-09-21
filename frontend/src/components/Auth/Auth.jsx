import React, { useState } from "react";
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
  Container,
  Avatar,
  Divider,
} from "@mui/material";
import { LockOutlined, School, AdminPanelSettings } from "@mui/icons-material";

const Login = () => {
  const [formData, setFormData] = useState({
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
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: "primary.main",
                width: 56,
                height: 56,
              }}
            >
              <LockOutlined fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold">
              Smart Allocation Portal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Connect students with perfect internship opportunities
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Login as:
                </Typography>
                <RadioGroup
                  row
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  sx={{ gap: 2 }}
                >
                  <FormControlLabel
                    value="student"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <School fontSize="small" />
                        Student
                      </Box>
                    }
                    sx={{
                      border: "1px solid",
                      borderColor: formData.role === "student" ? "primary.main" : "grey.300",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      mr: 1,
                    }}
                  />
                  <FormControlLabel
                    value="admin"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AdminPanelSettings fontSize="small" />
                        Admin
                      </Box>
                    }
                    sx={{
                      border: "1px solid",
                      borderColor: formData.role === "admin" ? "primary.main" : "grey.300",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                    }}
                  />
                </RadioGroup>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  boxShadow: "0 3px 5px 2px rgba(25, 118, 210, .3)",
                }}
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Button
            href="/register"
            variant="outlined"
            fullWidth
            size="large"
            sx={{ py: 1.5 }}
          >
            Create New Account
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

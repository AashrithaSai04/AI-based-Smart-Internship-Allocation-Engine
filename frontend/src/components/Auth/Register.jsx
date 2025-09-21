import React, { useState } from "react";
import { registerUser } from "../../api/api";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Stack,
} from "@mui/material";

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
    name: "",
    skills: "",
    preferences: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Registration successful!");
      if (onRegisterSuccess) {
        onRegisterSuccess(formData.role);
      }
    } catch (error) {
      alert("Registration failed.");
    }
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
          maxWidth: 420,
          mx: 2,
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h5" mb={2} align="center">
          Create Account
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
            <FormLabel>Register as</FormLabel>
            <RadioGroup
              row
              name="role"
              value={formData.role}
              onChange={handleChange}
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
            {formData.role === "student" && (
              <>
                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Skills (comma separated)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Preferences (location, type, etc.)"
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleChange}
                  multiline
                  minRows={2}
                  fullWidth
                />
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Upload Resume
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    required
                    hidden
                  />
                </Button>
                {formData.resume && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {formData.resume.name}
                  </Typography>
                )}
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Register
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;

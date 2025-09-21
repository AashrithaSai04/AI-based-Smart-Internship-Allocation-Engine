
import Register from './components/Auth/Register.jsx';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Radio, RadioGroup, FormControlLabel, Paper } from '@mui/material';

function Login({ onLogin, onRegister }) {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.role);
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <RadioGroup row name="role" value={formData.role} onChange={handleChange} sx={{ mb: 2 }}>
            <FormControlLabel value="student" control={<Radio />} label="Login as Student" />
            <FormControlLabel value="admin" control={<Radio />} label="Login as Admin" />
          </RadioGroup>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 1 }}>
            Login
          </Button>
        </form>
        <Button onClick={onRegister} color="secondary" fullWidth>New user? Register</Button>
      </Paper>
    </Box>
  );
}



import StudentDashboard from './components/Student/StudentDashboard.jsx';
import AdminDashboard from './components/Admin/Dashboard.jsx';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  // After login, show the correct portal

  if (loggedIn && role === 'student') {
    return <StudentDashboard />;
  }
  if (loggedIn && role === 'admin') {
    return <AdminDashboard />;
  }

  // Show register page, pass callback to set role and login

  if (showRegister) {
    return <Register onRegisterSuccess={(role) => { setRole(role); setLoggedIn(true); setShowRegister(false); }} />;
  }

  // Show login page, pass callback to set role and login
  return <Login 
    onLogin={(role) => {
      setRole(role);
      setLoggedIn(true);
    }} 
    onRegister={() => setShowRegister(true)} 
  />;
}

export default App;

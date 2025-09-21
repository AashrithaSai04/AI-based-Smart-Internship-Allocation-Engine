import React, { useState } from "react";
import { registerUser } from "../../api/api";


const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "student" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        placeholder="Password"
      />
      <div style={{ margin: '10px 0' }}>
        <label>
          <input
            type="radio"
            name="role"
            value="student"
            checked={formData.role === "student"}
            onChange={handleChange}
          />
          Register as Student
        </label>
        <label style={{ marginLeft: 20 }}>
          <input
            type="radio"
            name="role"
            value="admin"
            checked={formData.role === "admin"}
            onChange={handleChange}
          />
          Register as Admin
        </label>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

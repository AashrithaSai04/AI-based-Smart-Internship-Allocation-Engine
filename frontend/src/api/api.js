// api.js

// Comment out or remove the real axios-based imports
// import axios from 'axios';
// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Import the mock functions
import {
  mockGetInternships,
  mockGetAdminDashboardStats,
  mockMatchStudents,
  mockSubmitApplication,
} from './mockApi';

export const getInternships = () => mockGetInternships();
export const getAdminDashboardStats = () => mockGetAdminDashboardStats();
export const matchStudents = (preferences) => mockMatchStudents(preferences);
export const submitApplication = (internshipId, data) =>
  mockSubmitApplication(internshipId, data);

// Add other functions as needed (e.g., login, register) and mock them as well
export const registerUser = async (formData) => {
    console.log('Mocking user registration with:', formData);
    return { status: 200, message: 'Registration successful' };
};
export const loginUser = async (formData) => {
    console.log('Mocking user login with:', formData);
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsImlhdCI6MTY3ODkwMTIzNH0.S-gTjY6wD6hW5z_Iu-0jV-R2QyG-8b9D-Y2Qf5y5ZtY";
    localStorage.setItem('token', mockToken);
    return { status: 200, message: 'Login successful' };
};

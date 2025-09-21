// api.js - Updated for backend integration

// Import mock functions for fallback
import {
  mockGetInternships,
  mockGetAdminDashboardStats,
  mockMatchStudents,
  mockSubmitApplication,
} from './mockApi';

// Base API configuration
const API_BASE_URL = 'http://localhost:5000'; // Backend Flask server

export const getInternships = async () => {
  try {
    // For now, use mock data since backend doesn't have a get all endpoint
    // TODO: Add backend endpoint to retrieve all internships
    return await mockGetInternships();
  } catch (error) {
    console.error('Error fetching internships:', error);
    throw error;
  }
};

export const getAdminDashboardStats = () => mockGetAdminDashboardStats();

// Match internships for a student resume
export const matchInternships = async (resumeIndex, topN = 15) => {
  try {
    const response = await fetch(`${API_BASE_URL}/match_internships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume_index: resumeIndex,
        top_n: topN
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error matching internships:', error);
    throw error;
  }
};

// Match resumes for a job/internship
export const matchResumes = async (jobIndex, topN = 15) => {
  try {
    const response = await fetch(`${API_BASE_URL}/match_resumes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_index: jobIndex,
        top_n: topN
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error matching resumes:', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const matchStudents = async (criteria) => {
  try {
    // Check if criteria includes job_index for real backend call
    if (criteria && criteria.jobIndex !== undefined) {
      return await matchResumes(criteria.jobIndex, criteria.topN || 15);
    }
    // Fallback to mock data
    return await mockMatchStudents(criteria);
  } catch (error) {
    console.error('Error matching students:', error);
    return await mockMatchStudents(criteria);
  }
};

export const submitApplication = (internshipId, data) =>
  mockSubmitApplication(internshipId, data);

// Upload and match resume text (new function)
export const uploadResumeAndMatch = async (resumeText) => {
  try {
    // TODO: Backend endpoint for text-based resume upload and matching
    // For now, simulate with formatted mock data
    console.log('Uploading resume text for matching:', resumeText.substring(0, 100) + '...');
    
    // Return formatted mock data similar to backend response
    return [
      {
        "Role": "Data Science Internship",
        "Company Name": "Tech Corp",
        "Location": "Bangalore",
        "Skills": "Python, Machine Learning, SQL",
        "Stipend": "₹15,000/month",
        "Skills_Score": 0.85,
        "Final_Score": 0.82,
        "Sector": "Technology"
      },
      {
        "Role": "Software Development Internship", 
        "Company Name": "StartupXYZ",
        "Location": "Mumbai",
        "Skills": "React, JavaScript, Node.js",
        "Stipend": "₹12,000/month",
        "Skills_Score": 0.75,
        "Final_Score": 0.73,
        "Sector": "Technology"
      }
    ];
  } catch (error) {
    console.error('Error uploading resume and matching:', error);
    throw error;
  }
};

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

// New API functions for file upload and deadline management

// Upload resume file (PDF/DOCX) with optional instant matching
export const uploadResumeFile = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('instant_match', options.instantMatch || 'false');
    formData.append('top_n', options.topN || 10);
    formData.append('location', options.location || '');
    formData.append('social_category', options.socialCategory || 'General');
    formData.append('past_participation', options.pastParticipation || 0);

    const response = await fetch(`${API_BASE_URL}/upload_resume`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading resume file:', error);
    throw error;
  }
};

// Submit application for internship (with deadline support)
export const submitInternshipApplication = async (applicationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit_application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

// Set deadline for internship applications
export const setDeadline = async (internshipId, deadline) => {
  try {
    const response = await fetch(`${API_BASE_URL}/set_deadline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        internship_id: internshipId,
        deadline: deadline
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting deadline:', error);
    throw error;
  }
};

// Get all applications or filter by internship
export const getApplications = async (internshipId = null) => {
  try {
    let url = `${API_BASE_URL}/get_applications`;
    if (internshipId) {
      url += `?internship_id=${internshipId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Process deadline-based matching
export const processDeadlineMatching = async (internshipId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/process_deadline_matching`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        internship_id: internshipId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing deadline matching:', error);
    throw error;
  }
};

// Additional admin functions for application management
export const setApplicationDeadline = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/set_deadline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting application deadline:', error);
    throw error;
  }
};

export const triggerBatchMatching = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/trigger_batch_matching`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering batch matching:', error);
    throw error;
  }
};

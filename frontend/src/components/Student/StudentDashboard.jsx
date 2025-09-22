import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  LinearProgress,
  Divider
} from "@mui/material";
import { 
  Upload as UploadIcon, 
  Search as SearchIcon,
  CloudUpload,
  Description,
  CheckCircle
} from "@mui/icons-material";
import { getInternships, uploadResumeFile, submitInternshipApplication } from "../../api/api";

const StudentDashboard = () => {
  const [tab, setTab] = useState(0);
  const [internships, setInternships] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [matchedInternships, setMatchedInternships] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  
  // New file upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [instantMatch, setInstantMatch] = useState(true);
  const [userLocation, setUserLocation] = useState("");
  const [socialCategory, setSocialCategory] = useState("General");
  const [pastParticipation, setPastParticipation] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [applications, setApplications] = useState([]);

  const mockApplied = [
    { id: 1, title: "Software Development Intern", company: "Tech Corp", status: "Under Review" },
    { id: 2, title: "Data Science Intern", company: "Data Lab", status: "Accepted" },
  ];

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await getInternships();
      setInternships(response.data || []);
    } catch (error) {
      console.error("Failed to fetch internships", error);
      // Use mock data
      setInternships([
        { id: 1, title: "Frontend Developer", company: "TechStart", location: "Remote" },
        { id: 2, title: "Backend Developer", company: "DataCorp", location: "NYC" },
      ]);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setUploadError("");
      } else {
        setUploadError("Please select a PDF or DOCX file");
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    // Client-side file validation
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadError("Please upload only PDF or DOCX files");
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const options = {
        instantMatch: instantMatch.toString(),
        topN: 10,
        location: userLocation,
        socialCategory: socialCategory,
        pastParticipation: pastParticipation
      };

      const result = await uploadResumeFile(selectedFile, options);
      
      setUploadSuccess(result.message);
      
      if (result.resume_text) {
        setResumeText(result.resume_text);
      }
      
      if (result.instant_matches) {
        setMatchedInternships(result.instant_matches);
        setShowMatchDialog(true);
      }
      
    } catch (error) {
      // Enhanced error handling for specific validation errors
      if (error.message.includes("Invalid resume content")) {
        setUploadError(`❌ ${error.message}\n\nPlease upload a proper resume containing:\n• Personal information (name, contact)\n• Work experience or education\n• Skills and qualifications`);
      } else {
        setUploadError(error.message || "Error uploading resume");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeMatch = async () => {
    if (!resumeText.trim()) {
      setMatchError("Please enter your resume text or upload a resume file");
      return;
    }

    setIsMatching(true);
    setMatchError("");
    
    try {
      // Create a temporary file from text for matching
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const file = new File([blob], 'resume.txt', { type: 'text/plain' });
      
      const options = {
        instantMatch: 'true',
        topN: 10,
        location: userLocation,
        socialCategory: socialCategory,
        pastParticipation: pastParticipation
      };

      const result = await uploadResumeFile(file, options);
      if (result.instant_matches) {
        setMatchedInternships(result.instant_matches);
        setShowMatchDialog(true);
      }
    } catch (error) {
      console.error("Error matching resume:", error);
      setMatchError("Failed to match resume. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  const handleApply = async (internship) => {
    try {
      // Check if required fields are filled
      if (!studentName || !studentEmail) {
        alert("Please fill in your name and email in the profile section first.");
        return;
      }

      const applicationData = {
        student_name: studentName,
        student_email: studentEmail,
        resume_text: resumeText,
        internship_id: internship.id || internship._id || `${internship.Role}-${internship.Company}`,
        location: userLocation,
        social_category: socialCategory,
        past_participation: pastParticipation
      };

      const result = await submitInternshipApplication(applicationData);
      
      // Add to local applications list
      const newApplication = {
        ...applicationData,
        application_id: result.application_id,
        internship_title: internship.Role || internship.title,
        company: internship.Company || internship.company,
        status: "pending",
        submitted_at: new Date().toISOString()
      };
      setApplications(prev => [...prev, newApplication]);
      
      alert(`Application submitted successfully! Application ID: ${result.application_id}`);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: "bold" }}>
        Student Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="primary">3</Typography>
              <Typography variant="body2">Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="warning.main">2</Typography>
              <Typography variant="body2">Interviews</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="success.main">1</Typography>
              <Typography variant="body2">Offers</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Available Internships" />
            <Tab label="AI Resume Matching" />
            <Tab label="My Applications" />
          </Tabs>
        </Box>
        
        {tab === 0 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Internships
            </Typography>
            <Grid container spacing={2}>
              {internships.map((internship) => (
                <Grid item xs={12} md={6} key={internship.id || internship._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{internship.title}</Typography>
                      <Typography color="text.secondary">{internship.company}</Typography>
                      <Typography variant="body2">{internship.location}</Typography>
                      <Button 
                        variant="contained" 
                        size="small" 
                        sx={{ mt: 2 }}
                        onClick={() => handleApply(internship)}
                        disabled={!resumeText}
                      >
                        Apply Now
                      </Button>
                      {!resumeText && (
                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                          Upload resume first to apply
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}

        {tab === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: "#1976d2", fontWeight: "bold" }}>
              AI-Powered Resume Matching
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Upload your resume file (PDF/DOCX) or paste text to get personalized internship recommendations
            </Typography>
            
            <Grid container spacing={4}>
              {/* File Upload Section */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, border: '2px dashed #1976d2', bgcolor: '#f8fafc' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUpload color="primary" />
                    Upload Resume File
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    📄 Upload your resume in PDF or DOCX format (max 10MB)
                    <br />
                    ✅ Must contain: Personal info, education/experience, skills
                    <br />
                    ❌ Academic papers, invoices, or random documents will be rejected
                  </Typography>
                  
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="resume-upload"
                  />
                  
                  <label htmlFor="resume-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 2, minWidth: 200 }}
                      size="large"
                    >
                      Choose Resume (PDF/DOCX)
                    </Button>
                  </label>
                  
                  {selectedFile && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Description color="primary" />
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    </Box>
                  )}
                  
                  {/* User Information */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name *"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        size="small"
                        placeholder="Enter your full name"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address *"
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        size="small"
                        placeholder="Enter your email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Location</InputLabel>
                        <Select
                          value={userLocation}
                          label="Location"
                          onChange={(e) => setUserLocation(e.target.value)}
                        >
                          <MenuItem value="Mumbai">Mumbai</MenuItem>
                          <MenuItem value="Delhi">Delhi</MenuItem>
                          <MenuItem value="Bangalore">Bangalore</MenuItem>
                          <MenuItem value="Chennai">Chennai</MenuItem>
                          <MenuItem value="Kolkata">Kolkata</MenuItem>
                          <MenuItem value="Pune">Pune</MenuItem>
                          <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Social Category</InputLabel>
                        <Select
                          value={socialCategory}
                          label="Social Category"
                          onChange={(e) => setSocialCategory(e.target.value)}
                        >
                          <MenuItem value="General">General</MenuItem>
                          <MenuItem value="OBC">OBC</MenuItem>
                          <MenuItem value="SC">SC</MenuItem>
                          <MenuItem value="ST">ST</MenuItem>
                          <MenuItem value="EWS">EWS</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={pastParticipation > 0}
                            onChange={(e) => setPastParticipation(e.target.checked ? 1 : 0)}
                          />
                        }
                        label="Previous internship experience"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={instantMatch}
                            onChange={(e) => setInstantMatch(e.target.checked)}
                          />
                        }
                        label="Get instant matches (for demo)"
                      />
                    </Grid>
                  </Grid>
                  
                  {uploadError && (
                    <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                      {uploadError}
                    </Alert>
                  )}
                  
                  {uploadSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <CheckCircle sx={{ mr: 1 }} />
                      {uploadSuccess}
                    </Alert>
                  )}
                  
                  <Button
                    variant="contained"
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isUploading}
                    startIcon={isUploading ? <CircularProgress size={20} /> : <UploadIcon />}
                    size="large"
                    fullWidth
                    sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    {isUploading ? "Processing..." : "Upload & Analyze"}
                  </Button>
                </Card>
              </Grid>
              
              {/* Text Input Section */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, height: 'fit-content' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description color="primary" />
                    Or Paste Resume Text
                  </Typography>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    variant="outlined"
                    label="Paste your resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Copy and paste your resume content here for AI analysis..."
                    sx={{ mb: 2 }}
                  />
                  
                  {matchError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {matchError}
                    </Alert>
                  )}
                  
                  <Button
                    variant="contained"
                    startIcon={isMatching ? <CircularProgress size={20} /> : <SearchIcon />}
                    onClick={handleResumeMatch}
                    disabled={isMatching || !resumeText.trim()}
                    size="large"
                    fullWidth
                    sx={{ background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)' }}
                  >
                    {isMatching ? "Finding Matches..." : "Find Best Matches"}
                  </Button>
                </Card>
              </Grid>
              
              {/* Info Section */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)", p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
                    <UploadIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    AI Matching Features
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        📄 File Support
                      </Typography>
                      <Typography variant="body2">
                        Upload PDF or DOCX resume files for automatic text extraction and analysis
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        🤖 AI Analysis
                      </Typography>
                      <Typography variant="body2">
                        Advanced NLP models analyze skills, experience, and match with internship requirements
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ⚡ Instant Results
                      </Typography>
                      <Typography variant="body2">
                        Get instant matches for demo purposes or submit for deadline-based processing
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}
        
        {tab === 2 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Application Status
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date Submitted</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Show submitted applications first */}
                  {applications.map((app) => (
                    <TableRow key={app.application_id}>
                      <TableCell>{app.internship_title}</TableCell>
                      <TableCell>{app.company}</TableCell>
                      <TableCell>
                        <Chip 
                          label={app.status} 
                          color={app.status === 'pending' ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(app.submitted_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {/* Show mock applications */}
                  {mockApplied.map((app) => (
                    <TableRow key={`mock-${app.id}`}>
                      <TableCell>{app.title}</TableCell>
                      <TableCell>{app.company}</TableCell>
                      <TableCell>
                        <Chip 
                          label={app.status} 
                          color={app.status === 'Under Review' ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  ))}
                  {applications.length === 0 && mockApplied.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                        No applications submitted yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* AI Match Results Dialog */}
        <Dialog 
          open={showMatchDialog} 
          onClose={() => setShowMatchDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Your Top Internship Matches
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Based on your resume analysis, here are your best-matched internships:
            </Typography>
            
            <Grid container spacing={2}>
              {matchedInternships.map((match, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6">{match.Role}</Typography>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                          {match["Company Name"]} • {match.Location}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Stipend:</strong> {match.Stipend}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Skills:</strong> {match.Skills}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          AI Match Score
                        </Typography>
                        <Rating 
                          value={(match.Final_Score || 0) * 5} 
                          readOnly 
                          precision={0.1}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2">
                          {((match.Final_Score || 0) * 100).toFixed(1)}% match
                        </Typography>
                        <Chip 
                          label={match.Sector} 
                          size="small" 
                          sx={{ mt: 1, mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          onClick={() => handleApply(match)}
                          disabled={!studentName || !studentEmail}
                          sx={{ mt: 1 }}
                        >
                          Apply Now
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowMatchDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};

export default StudentDashboard;

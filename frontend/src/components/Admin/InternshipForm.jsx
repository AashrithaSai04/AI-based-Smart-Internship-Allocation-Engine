import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Switch,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import {
  Save as SaveIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

const InternshipForm = ({ open, onClose, onSubmit, editingInternship = null }) => {
  const [formData, setFormData] = useState({
    role: editingInternship?.role || "",
    company: editingInternship?.company || "",
    location: editingInternship?.location || "",
    duration: editingInternship?.duration || "",
    stipend: editingInternship?.stipend || "",
    internType: editingInternship?.internType || "Internship",
    skills: editingInternship?.skills || [],
    perks: editingInternship?.perks || [],
    sector: editingInternship?.sector || "",
    description: editingInternship?.description || "",
    // AI Matching Criteria
    skillWeightPreference: editingInternship?.skillWeightPreference || 70,
    locationWeightPreference: editingInternship?.locationWeightPreference || 15,
    socialCategoryPreference: editingInternship?.socialCategoryPreference || "General",
    pastParticipationWeight: editingInternship?.pastParticipationWeight || 5,
    // Application Settings
    applicationDeadline: editingInternship?.applicationDeadline || "",
    maxApplications: editingInternship?.maxApplications || 100,
    enableAIMatching: editingInternship?.enableAIMatching !== false,
    autoMatchAfterDeadline: editingInternship?.autoMatchAfterDeadline !== false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Predefined options
  const skillOptions = [
    "React", "Angular", "Vue.js", "JavaScript", "TypeScript", "Python", "Java", 
    "C++", "C#", "PHP", "Ruby", "Go", "Rust", "Swift", "Kotlin", "Dart",
    "HTML", "CSS", "SASS", "Bootstrap", "Tailwind CSS", "Material UI",
    "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "ASP.NET",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins",
    "Git", "GitHub", "GitLab", "Jira", "Confluence", "Slack",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
    "Data Science", "Data Analysis", "Pandas", "NumPy", "Matplotlib",
    "UI/UX Design", "Figma", "Adobe XD", "Photoshop", "Illustrator",
    "Project Management", "Agile", "Scrum", "Digital Marketing", "SEO", "SEM"
  ];

  const perkOptions = [
    "Certificate", "Letter of recommendation", "Job offer", "Informal dress code",
    "Free snacks & beverages", "5 days a week", "Flexible hours", "Work from home",
    "Mentorship program", "Training sessions", "Team outings", "Health insurance"
  ];

  const sectorOptions = [
    "Technology", "Finance", "Healthcare", "Education", "Marketing", "Design",
    "Data Science", "Consulting", "Startups", "E-commerce", "Manufacturing", "Other"
  ];

  const locationOptions = [
    "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata",
    "Ahmedabad", "Jaipur", "Gurgaon", "Noida", "Remote", "Other"
  ];

  const handleSubmit = async () => {
    if (!formData.role || !formData.company || !formData.location) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error saving internship:", error);
      setError("Failed to save internship. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillsChange = (_, newValue) => {
    setFormData({ ...formData, skills: newValue });
  };

  const handlePerksChange = (_, newValue) => {
    setFormData({ ...formData, perks: newValue });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: "85vh",
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }
      }}
    >
      <DialogTitle>
        <Box 
          display="flex" 
          alignItems="center" 
          gap={1}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mx: -3,
            mt: -2,
            mb: 2,
            p: 3,
            borderRadius: '12px 12px 0 0',
          }}
        >
          <BusinessIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            {editingInternship ? "Edit Internship" : "Post New Internship"}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, pb: 3 }}>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, mb: 2, borderRadius: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <BusinessIcon />
                  Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role / Position Title *"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Software Development Intern"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name *"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., TechCorp Solutions"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Autocomplete
                options={locationOptions}
                value={formData.location}
                onChange={(_, newValue) => setFormData({ ...formData, location: newValue || "" })}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Location *" placeholder="Select or type location" />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 3 Months"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Stipend"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                placeholder="e.g., ₹15,000/month"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Intern Type</InputLabel>
                <Select
                  value={formData.internType}
                  onChange={(e) => setFormData({ ...formData, internType: e.target.value })}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        width: 250,
                      },
                    },
                  }}
                  sx={{
                    '& .MuiSelect-select': {
                      minHeight: '56px',
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  <MenuItem value="Internship" sx={{ fontSize: '1rem', py: 1.5 }}>
                    Internship
                  </MenuItem>
                  <MenuItem value="Internship with job offer" sx={{ fontSize: '1rem', py: 1.5 }}>
                    Internship with job offer
                  </MenuItem>
                  <MenuItem value="Part-time" sx={{ fontSize: '1rem', py: 1.5 }}>
                    Part-time
                  </MenuItem>
                  <MenuItem value="Full-time" sx={{ fontSize: '1rem', py: 1.5 }}>
                    Full-time
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={sectorOptions}
                value={formData.sector}
                onChange={(_, newValue) => setFormData({ ...formData, sector: newValue || "" })}
                freeSolo
                ListboxProps={{
                  style: {
                    maxHeight: 200,
                    fontSize: '1rem',
                  },
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Sector" 
                    placeholder="Select sector"
                    sx={{
                      '& .MuiInputBase-root': {
                        minHeight: '56px',
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} style={{ fontSize: '1rem', padding: '12px 16px' }}>
                    {option}
                  </li>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={skillOptions}
                value={formData.skills}
                onChange={handleSkillsChange}
                freeSolo
                ListboxProps={{
                  style: {
                    maxHeight: 250,
                    fontSize: '1rem',
                  },
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      variant="outlined" 
                      label={option} 
                      {...getTagProps({ index })}
                      sx={{ fontSize: '0.875rem', height: '32px' }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Required Skills"
                    placeholder="Add skills (type and press Enter)"
                    sx={{
                      '& .MuiInputBase-root': {
                        minHeight: '56px',
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} style={{ fontSize: '1rem', padding: '12px 16px' }}>
                    {option}
                  </li>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={perkOptions}
                value={formData.perks}
                onChange={handlePerksChange}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Perks & Benefits"
                    placeholder="Add perks"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the internship..."
              />
            </Grid>
              </Card>
            </Grid>

            {/* AI Matching Criteria */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, mb: 2, borderRadius: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AssessmentIcon />
                  AI Matching Criteria
                </Typography>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Skills Weight: {formData.skillWeightPreference}%</Typography>
              <Slider
                value={formData.skillWeightPreference}
                onChange={(_, value) => setFormData({ ...formData, skillWeightPreference: value })}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                color="primary"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Location Weight: {formData.locationWeightPreference}%</Typography>
              <Slider
                value={formData.locationWeightPreference}
                onChange={(_, value) => setFormData({ ...formData, locationWeightPreference: value })}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                color="secondary"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Social Category Preference</InputLabel>
                <Select
                  value={formData.socialCategoryPreference}
                  onChange={(e) => setFormData({ ...formData, socialCategoryPreference: e.target.value })}
                >
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="SC">SC (Scheduled Caste)</MenuItem>
                  <MenuItem value="ST">ST (Scheduled Tribe)</MenuItem>
                  <MenuItem value="OBC">OBC (Other Backward Class)</MenuItem>
                  <MenuItem value="Any">Any Category</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Past Participation Weight: {formData.pastParticipationWeight}%</Typography>
              <Slider
                value={formData.pastParticipationWeight}
                onChange={(_, value) => setFormData({ ...formData, pastParticipationWeight: value })}
                min={0}
                max={25}
                valueLabelDisplay="auto"
                color="warning"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom color="primary">
                <ScheduleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Application Settings
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Application Deadline"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Applications"
                value={formData.maxApplications}
                onChange={(e) => setFormData({ ...formData, maxApplications: parseInt(e.target.value) || 0 })}
                placeholder="100"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableAIMatching}
                    onChange={(e) => setFormData({ ...formData, enableAIMatching: e.target.checked })}
                  />
                }
                label="Enable AI-powered candidate matching"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoMatchAfterDeadline}
                    onChange={(e) => setFormData({ ...formData, autoMatchAfterDeadline: e.target.checked })}
                  />
                }
                label="Auto-match candidates after deadline"
              />
            </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {isSubmitting ? "Saving..." : editingInternship ? "Update Internship" : "Post Internship"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InternshipForm;

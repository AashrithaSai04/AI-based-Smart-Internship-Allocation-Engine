const MOCK_INTERNSHIPS = [
  {
    _id: '1',
    title: 'Software Development Intern',
    company: 'Innovate Solutions Inc.',
    requiredSkills: ['JavaScript', 'React', 'Node.js'],
    location: 'New York, NY',
  },
  {
    _id: '2',
    title: 'Data Science Intern',
    company: 'DataGenius Corp.',
    requiredSkills: ['Python', 'SQL', 'Machine Learning'],
    location: 'San Francisco, CA',
  },
  {
    _id: '3',
    title: 'UX/UI Design Intern',
    company: 'Creative Labs',
    requiredSkills: ['Figma', 'Sketch', 'User Research'],
    location: 'Austin, TX',
  },
];

const MOCK_ADMIN_STATS = {
  totalStudents: 150,
  totalInternships: 100,
  filledPositions: 65,
};

const MOCK_MATCH_RESULTS = {
  matches: [
    {
      studentId: 'stud_123',
      internshipId: 'int_1',
      score: 95,
    },
  ],
  breakdown: {
    skillMatch: 90,
    availabilityMatch: 100,
  },
};

export const mockGetInternships = async () => {
  return { data: MOCK_INTERNSHIPS };
};

export const mockGetAdminDashboardStats = async () => {
  return { data: MOCK_ADMIN_STATS };
};

export const mockMatchStudents = async (preferences) => {
  console.log('Mocking match with preferences:', preferences);
  return { data: MOCK_MATCH_RESULTS };
};

export const mockSubmitApplication = async (internshipId, data) => {
  console.log(`Mocking application for ${internshipId} with data:`, data);
  return { status: 200, message: 'Application mocked successfully' };
};

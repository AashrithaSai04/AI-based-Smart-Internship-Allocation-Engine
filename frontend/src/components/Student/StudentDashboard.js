// This file has been migrated to StudentDashboard.jsx. Please use StudentDashboard.jsx for the StudentDashboard component.
import React, { useState, useEffect } from "react";
import { getInternships } from "../../api/api";

const StudentDashboard = () => {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await getInternships();
      setInternships(response.data);
    } catch (error) {
      console.error("Failed to fetch internships", error);
    }
  };

  return (
    <div>
      <h2>Available Internships</h2>
      <ul>
        {internships.map((internship) => (
          <li key={internship._id}>
            <h3>{internship.title}</h3>
            <p>{internship.company}</p>
            <p>Skills: {internship.requiredSkills.join(", ")}</p>
            <a href={`/apply/${internship._id}`}>Apply Now</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDashboard;

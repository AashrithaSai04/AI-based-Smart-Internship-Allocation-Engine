import React, { useState } from 'react';
import { submitApplication } from '../../api/api';

const ApplicationForm = ({ internshipId }) => {
    const [formData, setFormData] = useState({ skills: '', preferences: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitApplication(internshipId, formData);
            alert('Application submitted successfully!');
        } catch (error) {
            alert('Failed to submit application.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Apply for Internship</h3>
            <label>Skills (comma-separated):</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} required />
            <label>Preferences:</label>
            <textarea name="preferences" value={formData.preferences} onChange={handleChange}></textarea>
            <button type="submit">Submit Application</button>
        </form>
    );
};

export default ApplicationForm;

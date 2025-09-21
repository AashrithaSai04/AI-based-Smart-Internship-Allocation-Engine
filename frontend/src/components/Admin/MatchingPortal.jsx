import React, { useState } from "react";
import { matchStudents } from "../../api/api";

const MatchingPortal = () => {
  const [preferences, setPreferences] = useState({
    skillWeight: 50,
    availabilityWeight: 30,
    locationWeight: 20,
  });
  const [results, setResults] = useState(null);

  const handleSliderChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  const handleMatch = async () => {
    try {
      const response = await matchStudents(preferences);
      setResults(response.data);
      alert("Matching process completed!");
    } catch (error) {
      console.error("Matching failed", error);
      alert("Matching failed. See console for details.");
    }
  };

  return (
    <div>
      <h2>Intelligent Matching Portal</h2>
      <div className="sliders">
        <label>Skill Match Weight:</label>
        <input
          type="range"
          name="skillWeight"
          min="0"
          max="100"
          value={preferences.skillWeight}
          onChange={handleSliderChange}
        />
        <span>{preferences.skillWeight}%</span>
      </div>
      {/* Other sliders for preferences */}
      <button onClick={handleMatch}>Run AI Matching Engine</button>

      {results && (
        <div className="results">
          <h3>Match Results</h3>
          {/* Display a breakdown of the match score */}
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MatchingPortal;

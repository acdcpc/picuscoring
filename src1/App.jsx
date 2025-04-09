import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScoreInputPage from "./pages/ScoreInputPage";
import ScoreResultsPage from "./pages/ScoreResultsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Score entry form */}
          <Route path="/patients/:patientId/score/:scoreType" element={<ScoreInputPage />} />

          {/* Result page */}
          <Route path="/patients/:patientId/results/:assessmentId" element={<ScoreResultsPage />} />

          {/* Optional: add a default home or 404 route later */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

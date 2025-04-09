
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScoreInputPage from "./pages/ScoreInputPage";
import ScoreResultsPage from "./pages/ScoreResultsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/patients/:patientId/input/:scoreType" element={<ScoreInputPage />} />
        <Route path="/patients/:patientId/results/:assessmentId" element={<ScoreResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

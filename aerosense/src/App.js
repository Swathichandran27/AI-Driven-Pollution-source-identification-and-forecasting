import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/PolicyMaker/dashboard";
import SourceIdentification from "./pages/PolicyMaker/sourceidentification";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      

<Route
  path="/policy/source-identification"
  element={<SourceIdentification />}
/>

      </Routes>
    </Router>
  );
}

export default App;

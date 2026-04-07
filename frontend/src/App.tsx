import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddCandidatePage from "./pages/AddCandidatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/candidates/add" element={<AddCandidatePage />} />
        <Route path="/" element={<Navigate to="/candidates/add" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

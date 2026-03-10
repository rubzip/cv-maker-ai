import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MainLayout } from "./layouts/MainLayout"

import Dashboard from "./pages/Dashboard"
import CvManager from "./pages/CvManager"
import JobTracker from "./pages/JobTracker"
import Editor from "./pages/Editor"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cvs" element={<CvManager />} />
          <Route path="/jobs" element={<JobTracker />} />
        </Route>
        <Route path="/editor/:cvId" element={<Editor />} />
      </Routes>
    </Router>
  )
}

export default App

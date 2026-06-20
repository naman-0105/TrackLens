import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout.js";

import Overview from "./pages/Overview.js";
import Sessions from "./pages/Sessions.js";
import SessionDetails from "./pages/SessionDetails.js";
import Heatmap from "./pages/Heatmap.js";
import NotFound from "./pages/NotFound.js";

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Overview />} />

        <Route path="sessions" element={<Sessions />} />

        <Route path="sessions/:sessionId" element={<SessionDetails />} />

        <Route path="heatmap" element={<Heatmap />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

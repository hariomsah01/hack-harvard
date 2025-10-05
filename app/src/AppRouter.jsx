import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";        // we'll create this next
import MapPage from "./App";      // <-- your existing working tool (leave it as-is)
import Explore from "./pages/Explore.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        {/* The button will navigate here */}
        <Route path="/discover" element={<MapPage />} />
        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

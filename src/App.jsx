import Analysis from "./pages/analysis/main";
import Home from "./pages/home/main";
import QuantivaLinks from "./pages/links/main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/links" element={<QuantivaLinks />} />
      </Routes>
    </Router>   
  )
}
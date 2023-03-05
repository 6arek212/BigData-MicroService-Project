import "./css/app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./presentation/components/NavBar/NavBar";
import Orders from "./presentation/pages/Orders/Orders";
import Dashboard from "./presentation/pages/Dashboard/Dashboard";
import Analyze from "./presentation/pages/Analyze/Analyze";
function App() {
  return (
      <BrowserRouter>
        <div className="app-wrapper">
          <NavBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/analyze" element={<Analyze />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;

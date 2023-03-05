import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
function NavBar() {
  const [activeNav, setActiveNav] = useState(0);
  return (
    <div className="navbar-container">
      <ul className="nav-links">
        <li className={activeNav === 0 ? "active" : null}>
          <Link to="/" className="nav-link" onClick={() => setActiveNav(0)}>
            <img
              src={require("../../../assets/icons/dashboard.png")}
              alt="dashboardLogo"
            />
          </Link>
        </li>
        <li className={activeNav === 1 ? "active" : null}>
          <Link
            to="/orders"
            className="nav-link"
            onClick={() => setActiveNav(1)}
          >
            <img
              src={require("../../../assets/icons/find.png")}
              alt="findLogo"
            />
          </Link>
        </li>
        <li className={activeNav === 2 ? "active" : null}>
          <Link
            to="/analyze"
            className="nav-link"
            onClick={() => setActiveNav(2)}
          >
            <img
              src={require("../../../assets/icons/analysing.png")}
              alt="analyseLogo"
            />
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;

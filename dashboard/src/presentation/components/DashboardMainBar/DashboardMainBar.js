import React from "react";
import "./DashboardMainBar.css";
import { FaCalendarAlt } from "react-icons/fa";
import moment from "moment/moment";
function DashboardMainBar({ date }) {
  return (
    <div className="dashboard-main-bar-container">
      <div className="board-info">
        <h3>Hello Wissam !</h3>
        <span>here is a central view of a big data network</span>
      </div>
      <div className="board-date">
        <span>{moment(date).format("LLL")}</span>
        <FaCalendarAlt />
      </div>
      <img src={require("../../../assets/imgs/cat.jpg")} />
    </div>
  );
}

export default DashboardMainBar;

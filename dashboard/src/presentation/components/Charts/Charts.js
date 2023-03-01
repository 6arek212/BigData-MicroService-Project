import React from "react";
import "./Charts.css";
import { Chart } from "react-google-charts";

function Charts() {
  return (
    <div className="charts-container">
      <div className="piChart-container">
        <Chart
          chartType="PieChart"
          data={data}
          // options={options}
          width={"50%"}
          height={"200px"}
        />
      </div>
    </div>
  );
}

export default Charts;

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Dashboard.css";
import DashboardMainBar from "../../components/DashboardMainBar/DashboardMainBar";
import ChartView from "../../components/ChartView/ChartView";
import Chart from "react-google-charts";
import StatusCards from "../../components/StatusCards";
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [disData, setDisData] = useState([]);
  const [branchesData, setBranchersData] = useState([]);
  const [topToppings, setTopToppings] = useState([]);
  const [orderByHour, setOrderByHour] = useState([]);
  const [date, setDate] = useState(new Date());

  const options = {
    title: "Orders",
    curveType: "function",
    legend: { position: "bottom" },
    series: [{ color: "#1E2640" }],
  };
  //----------------------------\\
  useEffect(() => {
    const socket = io("http://localhost:4000", { transports: ["websocket"] });
    socket.on("stats", (data) => {
      let disData = [["Task", "Hours per Day"]];
      data?.distribution.forEach((data) =>
        disData.push([data.key, parseInt(data.value, 10)])
      );
      let brData = [["Element", "Density", { role: "style" }]];
      data?.topProcessTimes.forEach((data) =>
        brData.push([data.key, Number(data.value, 10), "#1E2640"])
      );
      let topT = [["Element", "Density", { role: "style" }]];
      data?.topAdditions.forEach((data) =>
        topT.push([data.key, Number(data.value, 10), "#1E2640"])
      );
      let _orderbyHour = [["Time", "Orders"]];
      data?.orderByHour.forEach((data) =>
        _orderbyHour.push([data.key.split(" ")[1], Number(data.value, 10)])
      );


      setOrderByHour(_orderbyHour);
      setTopToppings(topT);
      setBranchersData(brData);
      setDisData(disData);
      setStats(data);
      setDate(new Date());
    });
    return () => {
      if (socket.readyState === 1) { 
        socket.close();
      }
    };
  }, []);

  //----------------------------\\

  return (
    <div className="page-container">
      <div className="dashboard-container">
        <DashboardMainBar date={date} />
        <StatusCards stats={stats} />
        <div className="charts-container">
          <ChartView
            chartType="ColumnChart"
            chartData={topToppings}
            title="Top Ordered Toppings"
            width="310px"
            height="180px"
          />
          <ChartView
            chartType="ColumnChart"
            chartData={branchesData}
            title="Best Preparing Time's Branches"
            width="310px"
            height="180px"
          />
          <ChartView
            chartType="PieChart"
            chartData={disData}
            title="Orders Distribution"
            width="340px"
            height="200px"
          />
        </div>
        <div className="line-chart-container">
          <Chart
            chartType="LineChart"
            width="100%"
            height="200px"
            data={orderByHour}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

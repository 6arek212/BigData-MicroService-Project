import React, { useState } from "react";
import AnalyzeTable from "../../components/AnalyzeTable/AnalyzeTable";
import DatePicker from "react-datepicker";
function Analyze() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <div className="page-container">
      <div className="analyze-header-main">
        <div className="analyze-cta">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setStartDate(endDate)}
          />
          <button>Make Model</button>
        </div>
      </div>

      <AnalyzeTable />
    </div>
  );
}

export default Analyze;

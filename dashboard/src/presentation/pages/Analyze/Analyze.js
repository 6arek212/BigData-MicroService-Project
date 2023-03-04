import React, { useState } from "react";
import AnalyzeTable from "../../components/AnalyzeTable/AnalyzeTable";
// import DatePicker from "react-datepicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import "./Analyze.css";

function Analyze() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <div className="page-container">
      <div className="analyze-header-main">
        <div className="analyze-cta">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Start date"
              inputFormat="MM/DD/YYYY"
              value={startDate}
              onChange={(value) => setStartDate(value)}
              renderInput={(params) => (
                <TextField {...params} size="small" sx={{ width: "15%" }} />
              )}
            />

            <DesktopDatePicker
              label="End date"
              inputFormat="MM/DD/YYYY"
              value={endDate}
              onChange={(value) => setEndDate(value)}
              renderInput={(params) => (
                <TextField {...params} size="small" sx={{ width: "15%" }} />
              )}
            />
          </LocalizationProvider>

          <button className="analyze-btn">Make Model</button>
        </div>
      </div>

      <AnalyzeTable />
    </div>
  );
}

export default Analyze;

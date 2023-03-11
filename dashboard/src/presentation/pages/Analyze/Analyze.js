import React, { useEffect, useMemo, useState } from "react";
import AnalyzeTable from "../../components/AnalyzeTable/AnalyzeTable";
// import DatePicker from "react-datepicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { io } from "socket.io-client";
import "./Analyze.css";
import moment from 'moment'

function Analyze() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [working, setWorking] = useState(false);

  const onMakeModel = async () => {
    try {
      const s = moment(startDate).startOf('day');
      const e = moment(endDate).endOf('day');

      setWorking(true)
      await fetch(`http://localhost:4000/api/train?startDate=${s}&endDate=${e}`);

    } catch (e) {
      setWorking(false)
      console.log(e);
    }
  }

  useEffect(() => {
    const socket = io("http://localhost:4000", { transports: ["websocket"] })

    socket.on('association_model', (data) => {
      setData(data)
      setWorking(false)
    })


    return () => {
      socket.disconnect();
    }
  }, [])

  return (
    <div className="page-container">
      <div className="analyze-header-main">
        <div className="analyze-cta">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Start date"
              inputFormat="DD/MM/YYYY"
              value={startDate}
              onChange={(value) => setStartDate(value.$d)}
              renderInput={(params) => (
                <TextField {...params} size="small" sx={{ width: "15%" }} />
              )}
            />

            <DesktopDatePicker
              label="End date"
              inputFormat="DD/MM/YYYY"
              value={endDate}
              onChange={(value) => setEndDate(value.$d)}
              renderInput={(params) => (
                <TextField {...params} size="small" sx={{ width: "15%" }} />
              )}
            />
          </LocalizationProvider>

          <button className="analyze-btn" disabled={working} onClick={onMakeModel}>{working ? 'Working...' : 'Make Model'}</button>
        </div>
      </div>

      <AnalyzeTable data={data} />
    </div>
  );
}

export default Analyze;

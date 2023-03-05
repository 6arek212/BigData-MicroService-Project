import React, { useState, useEffect } from "react";
import "./Orders.css";
import OrderCard from "../../components/OrderCard/OrderCard";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiPhoneCall } from "react-icons/fi";
import OrderStatusCard from "../../components/OrderStatusCard/OrderStatusCard";
import OrderItemInfo from "../../components/OrderItemInfo/OrderItemInfo";
import ItemToppings from "../../components/ItemToppings/ItemToppings";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import moment from "moment";

const BASE_URL = "http://localhost:4000/api";

function Orders() {
  const [date, setDate] = useState(new Date());
  const [showToppings, setShowToppings] = useState(false);
  const [region, setRegion] = useState("");
  const [orders, setOrders] = useState([]);
  const options = [
    { value: "South", label: "South" },
    { value: "Haifa", label: "Haifa" },
    { value: "Center", label: "Center" },
    { value: "North", label: "North" },
    { value: "Dan", label: "Dan" },
  ];

  const format = "yyyy-MM-DDTHH:mm";

  const fetchData = async () => {
    const startDate = moment(date).startOf("day").format(format);
    const endDate = moment(date).endOf("day").format(format);
    console.log(startDate);
    console.log(endDate);
    const res = await fetch(
      BASE_URL +
        `/search?startDate=${startDate}&endDate=${endDate}&storeName=${region}`
    );
    console.log(res);
  };
  useEffect(() => {
    fetchData();
  }, [date]);
  console.log(region);

  return (
    <div className="page-container">
      <div className="ordersPage-container">
        <div className="orders-cta">
          <div className="search-orders-wrapper">
            <div className="select-option">
              <span>Branch</span>
              <div className="select-branch-options">
                <Select
                  options={options}
                  defaultValue="South"
                  onChange={(option) => setRegion(option.value)}
                />
              </div>
            </div>
            <div className="select-option">
              <span>Date</span>
              <div className="select-date-options">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    inputFormat="MM/DD/YYYY"
                    value={date}
                    onChange={(value) => setDate(value["$d"])}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <div className="orders-wrapper">
            <OrderCard isActive={true} />
            <OrderCard />
            <OrderCard />
          </div>
        </div>
        <div className="order-info-container">
          <h2>Order info</h2>
          <div className="order-info-row">
            <OrderStatusCard text="Perparing time" info="00h: 25m: 30s" />
            <OrderStatusCard text={"address"} info="Bartaa haifa" />
            <OrderStatusCard
              text={"Wissam kabha"}
              info={"0547973442"}
              icon={<FiPhoneCall color="#00B929" size={27} />}
            />
          </div>
          <div className="order-items">
            <OrderItemInfo
              dish={{ name: "pizza" }}
              total={5}
              handleShowToppings={() => setShowToppings(true)}
            />
            <OrderItemInfo
              dish={{ name: "pizza" }}
              total={5}
              handleShowToppings={() => setShowToppings(true)}
            />
          </div>
        </div>
        {showToppings && (
          <ItemToppings handlecloseToppings={() => setShowToppings(false)} />
        )}
      </div>
    </div>
  );
}

export default Orders;

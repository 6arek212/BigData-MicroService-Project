import React, { useState, useEffect } from "react";
import "./Orders.css";
import OrderCard from "../../components/OrderCard/OrderCard";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import OrderItemInfo from "../../components/OrderItemInfo/OrderItemInfo";
import ItemToppings from "../../components/ItemToppings/ItemToppings";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import OrderStatusRow from "../../components/OrderStatusRow";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import Spacer from "../../components/Spacer";

const BASE_URL = "http://localhost:4000/api";

function Orders() {
  const [date, setDate] = useState(new Date());
  const [showToppings, setShowToppings] = useState(false);
  const [region, setRegion] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const [startData, setStartData] = useState(new Date());

  const PAGE_SIZE = 10;
  const format = "yyyy-MM-DDTHH:mm:ss";
  const options = [
    { value: "", label: "All" },
    { value: "Macdonalds", label: "Macdonalds" },
    { value: "BBB", label: "BBB" },
    { value: "KFC", label: "KFC" },
    { value: "Pizza Hut", label: "Pizza Hut" },
  ];

  const fetchData = async () => {
    const startDate = moment(date).startOf("day").format(format);
    const endDate = moment(date).endOf("day").format(format);
    const res = await fetch(
      BASE_URL +
        `/search?startDate=${startDate}&endDate=${endDate}&storeName=${region}&page=${currentPage}&pageSize=${PAGE_SIZE}&searchDate=${startData}`
    );
    const data = await res.json();
    setOrders(data.data);
    setSelectedOrder(data.data[0]);
    setNumOfPages(Math.round(data.count / PAGE_SIZE));
  };

  const handleChangePage = (event, value) => {
    if (value == 1) {
      setStartData(new Date());
    }
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchData();
  }, [date, region, currentPage]);
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
                  onChange={(option) => {
                    setCurrentPage(1);
                    setRegion(option.value);
                  }}
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
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                isActive={selectedOrder._id == order._id}
                handleSelectOrder={(order) => setSelectedOrder(order)}
              />
            ))}
          </div>
          <Pagination
            count={numOfPages}
            variant="outlined"
            color="primary"
            onChange={handleChangePage}
            page={currentPage}
          />
        </div>
        <div className="order-info-container">
          <h2>Order info</h2>
          <OrderStatusRow selectedOrder={selectedOrder} />
          <Spacer space={15} />
          <div className="order-items">
            <OrderItemInfo
              dish={{ name: "pizza" }}
              total={1}
              handleShowToppings={() => setShowToppings(true)}
            />
          </div>
        </div>
        {showToppings && (
          <ItemToppings
            handlecloseToppings={() => setShowToppings(false)}
            toppings={selectedOrder?._source.additions}
          />
        )}
      </div>
    </div>
  );
}

export default Orders;

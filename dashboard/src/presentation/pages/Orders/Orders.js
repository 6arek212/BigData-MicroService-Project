import React, { useState } from "react";
import "./Orders.css";
import OrderCard from "../../components/OrderCard/OrderCard";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiPhoneCall } from "react-icons/fi";
import OrderStatusCard from "../../components/OrderStatusCard/OrderStatusCard";
import OrderItemInfo from "../../components/OrderItemInfo/OrderItemInfo";
import ItemToppings from "../../components/ItemToppings/ItemToppings";

function Orders() {
  const [startDate, setStartDate] = useState(new Date());
  const [showToppings, setShowToppings] = useState(false);
  const options = [
    { value: "Haifa", label: "Haifa" },
    { value: "TelAviv", label: "Tel Aviv" },
    { value: "Zikhron", label: "Zikhron Ya'akov" },
  ];

  return (
    <div className="page-container">
      <div className="ordersPage-container">
        <div className="orders-cta">
          <div className="search-orders-wrapper">
            <div className="select-option">
              <span>Branch</span>
              <div className="select-branch-options">
                <Select options={options} />
              </div>
            </div>
            <div className="select-option">
              <span>Date</span>
              <div className="select-date-options">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
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

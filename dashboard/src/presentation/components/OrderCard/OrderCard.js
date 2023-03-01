import React from "react";
import { BsClock } from "react-icons/bs";
import "./OrderCard.css";
function OrderCard(props) {
  const { handleSelectOrder, isActive } = props;
  return (
    <div className="orderCard-container">
      {isActive && <div className="activeMarker"></div>}
      <div className="order-card-content">
        <span>Order #00349</span>
        <div className="order-date">
          <BsClock color="#00000063" size={15} />
          <span>Today, 10:45</span>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;

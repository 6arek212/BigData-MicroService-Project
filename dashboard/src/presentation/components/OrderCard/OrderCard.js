import React from "react";
import { BsClock } from "react-icons/bs";
import "./OrderCard.css";
import moment from "moment";
function OrderCard(props) {
  const { handleSelectOrder, isActive, order } = props;
  return (
    <div
      className="orderCard-container"
      onClick={() => handleSelectOrder(order)}
    >
      {isActive && <div className="activeMarker"></div>}
      <div className="order-card-content">
        <span>Order {order._id.substring(0, 5)}</span>
        <div className="order-date">
          <BsClock color="#00000063" size={15} />
          <span>{moment(order._source.createdAt).calendar()}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;

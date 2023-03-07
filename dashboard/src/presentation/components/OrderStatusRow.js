import React from "react";
import OrderStatusCard from "./OrderStatusCard/OrderStatusCard";
import { FiPhoneCall } from "react-icons/fi";
function OrderStatusRow({ selectedOrder }) {
  return (
    <div className="order-info-row">
      <OrderStatusCard text="Region" info={selectedOrder?._source.region} />
      <OrderStatusCard text={"address"} info={selectedOrder?._source.address} />

      <OrderStatusCard text={"status"} info={selectedOrder?._source.status} />
      <OrderStatusCard
        text={selectedOrder?._source.name}
        info={selectedOrder?._source.phone}
        icon={<FiPhoneCall color="#00B929" size={27} />}
      />
    </div>
  );
}

export default OrderStatusRow;

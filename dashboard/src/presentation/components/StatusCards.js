import React from "react";
import BoardStatusCard from "./BoardStatusCard/BoardStatusCard";
function StatusCards({ stats }) {
  return (
    <div className="board-status-cards">
      <BoardStatusCard
        title="Open branches"
        total={stats?.opendStoresCount}
        icon={require("../../assets/icons/branch2.png")}
      />
      <BoardStatusCard
        title="Average preparing time"
        total={stats?.processAvg.toString().substring(0, 4)}
        icon={require("../../assets/icons/clockp.png")}
      />
      <BoardStatusCard
        title="Total open orders"
        total={stats?.ordersInProgressCount}
        icon={require("../../assets/icons/preparation.png")}
      />
      <BoardStatusCard
        title="Total orders placed today"
        total={stats?.ordersCount}
        icon={require("../../assets/icons/order.png")}
      />
    </div>
  );
}

export default StatusCards;

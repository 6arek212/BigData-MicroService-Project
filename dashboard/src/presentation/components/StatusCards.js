import React from "react";
import BoardStatusCard from "./BoardStatusCard/BoardStatusCard";
function StatusCards({ stats }) {
  return (
    <div className="board-status-cards">
      <BoardStatusCard
        title="Open Branches"
        total={stats?.opendStoresCount}
        icon={require("../../assets/icons/branch2.png")}
      />
      <BoardStatusCard
        title="Preparing AVG"
        total={stats?.processAvg.toString().substring(0, 4)}
        messure='sec'
        icon={require("../../assets/icons/clockp.png")}
      />
      <BoardStatusCard
        title="Open Orders"
        total={stats?.ordersInProgressCount}
        icon={require("../../assets/icons/preparation.png")}
      />
      <BoardStatusCard
        title="Orders"
        total={stats?.ordersCount}
        icon={require("../../assets/icons/order.png")}
      />
    </div>
  );
}

export default StatusCards;

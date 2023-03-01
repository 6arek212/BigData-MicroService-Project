import React from "react";
import "./BoardStatusCard.css";

function BoardStatusCard(props) {
  const { title, total, icon } = props;
  return (
    <div className="board-statuscard-container">
      <h3>{title}</h3>
      <div className="board-statuscard-icontotal">
        <span>{total}</span>
        <img src={icon} />
      </div>
    </div>
  );
}

export default BoardStatusCard;

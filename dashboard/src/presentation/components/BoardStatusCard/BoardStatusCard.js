import React from "react";
import "./BoardStatusCard.css";

function BoardStatusCard(props) {
  const { title, total, messure, icon } = props;
  return (
    <div className="board-statuscard-container">
      <h3>{title}</h3>
      <div className="board-statuscard-icontotal">
        <span>{total}</span>
        <p>{messure}</p>
        <img src={icon} />
      </div>
    </div>
  );
}

export default BoardStatusCard;

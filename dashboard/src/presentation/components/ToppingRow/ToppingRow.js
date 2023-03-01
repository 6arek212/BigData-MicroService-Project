import React from "react";
import "./ToppingRow.css";
function ToppingRow(props) {
  const { name, icon } = props;
  return (
    <div className="topping-row">
      <div className="topping-icon-container">
        <img src={icon} />
      </div>
      <span>{name}</span>
    </div>
  );
}

export default ToppingRow;

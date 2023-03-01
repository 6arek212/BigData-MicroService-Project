import React from "react";
import "./ItemToppings.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ToppingRow from "../ToppingRow/ToppingRow";
function ItemToppings(props) {
  const { handlecloseToppings } = props;
  return (
    <div className="item-toppings-container">
      <div className="item-toppings-cta">
        <h3>Toppings</h3>
        <button onClick={handlecloseToppings}>
          <AiOutlineCloseCircle size={23} color="gray" />
        </button>
      </div>
      <div className="toppings">
        <ToppingRow
          icon={require("../../../assets/icons/corn.png")}
          name="corn"
        />
        <ToppingRow
          icon={require("../../../assets/icons/olive.png")}
          name="olive"
        />
      </div>
    </div>
  );
}

export default ItemToppings;

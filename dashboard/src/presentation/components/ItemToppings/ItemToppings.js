import React from "react";
import "./ItemToppings.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ToppingRow from "../ToppingRow/ToppingRow";
function ItemToppings(props) {
  const { handlecloseToppings, toppings } = props;
  const additions = [
    "Onions",
    "Olives",
    "Mozzarella Cheese",
    "Peppers",
    "Tuna",
    "Sausage",
    "Pesto",
    "Tomato",
    "Black Olives",
  ];

  const getIconImg = (topping) => {
    switch (topping) {
      case additions[0]:
        return "onion.png";

      case additions[1]:
        return "olive.png";

      case additions[2]:
        return "cheese.png";

      case additions[3]:
        return "pepper.png";

      case additions[4]:
        return "tuna.png";
      case additions[5]:
        return "sausage.png";
      case additions[6]:
        return "pesto-genovese.png";
      case additions[7]:
        return "tomato.png";
      case additions[8]:
        return "blackolives.png";
      default:
        return "pizzab.png";
    }
  };

  return (
    <div className="item-toppings-container">
      <div className="item-toppings-cta">
        <h3>Toppings</h3>
        <button onClick={handlecloseToppings}>
          <AiOutlineCloseCircle size={23} color="gray" />
        </button>
      </div>
      <div className="toppings">
        {toppings.map((topping) => (
          <ToppingRow
            icon={require(`../../../assets/icons/${getIconImg(topping)}`)}
            name={topping}
          />
        ))}
      </div>
    </div>
  );
}

export default ItemToppings;

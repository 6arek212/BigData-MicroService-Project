import "./OrderItemInfo.css";
import "./OrderItemInfo.css";
function OrderItemInfo(props) {
  const { dish, total, handleShowToppings } = props;
  return (
    <div className="itemInfo-container">
      <img src={require("./../../../assets/imgs/pizza.png")} alt="pizzaimg" />
      <div className="itemInfo">
        <span>{dish.name}</span>
        <span className="total">x {total}</span>
        <button className="more-info-btn" onClick={handleShowToppings}>
          <img src={require("./../../../assets/icons/info.png")} />
        </button>
      </div>
    </div>
  );
}

export default OrderItemInfo;

import "./OrderStatusCard.css";

const OrderStatusCard = (props) => {
  const { text, info, icon } = props;
  return (
    <div className="order-status-card-container">
      <div className="textOrder">
        <span className="textMain">{text}</span>
        <span className="textSecondary">{info}</span>
      </div>
      {icon}
    </div>
  );
};

export default OrderStatusCard;

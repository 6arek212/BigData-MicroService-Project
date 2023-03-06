import './stylesheet.css'

const StoreStatus = ({ storeName, region, status }) => {
    return (
        <div className="store-status-container">
            <div>
                <h5>{storeName}</h5>
                <p>{region} </p>
            </div>
            <div className="spacer"></div>
            <img src={status === '1' ? require("../../../assets/icons/open.png") : require("../../../assets/icons/closed.png")} />
        </div>
    );
}

export default StoreStatus;
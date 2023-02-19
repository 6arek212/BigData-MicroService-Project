import './style.css'

const StatsCard = ({ title, value }) => {
    return (
        <div className="card">
            <h2>{title}</h2>
            <div className="space"></div>
            <p>
                {value}
            </p>
        </div>
    );
}

export default StatsCard;
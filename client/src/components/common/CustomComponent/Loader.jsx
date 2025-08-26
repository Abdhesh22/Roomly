const Loader = ({ show = true, message = "Loading Rooms..." }) => {
    if (!show) return null;

    return (
        <div className="loader-overlay">
            <div className="loader-content">
                <div className="loader-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p className="loader-text">{message}</p>
            </div>
        </div>
    );
};

export default Loader;
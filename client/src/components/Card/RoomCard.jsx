import { useNavigate } from "react-router-dom";

const RoomCard = ({ options }) => {
  const navigate = useNavigate();
  const calculatePrice = (price, percent) => {
    return price + price * (percent / 100);
  };

  const wordWrap = (values) => {
    if (values.length >= 25) {
      return values.substring(0, 25) + "..."; // Substring + ellipsis
    }
    return values;
  };

  const handleCardClick = (id) => {
    navigate(`/room/${id}`);
  };

  return (
    <>
      <div
        className="col-md-3 mb-3"
        key={options.id}
        onClick={() => handleCardClick(options.id)}
      >
        <div className="roomly-card card h-100">
          <div className="card-container">
            <a className="card-link" rel="noopener noreferrer"></a>
            <div className="card-header">
              <div className="guest-favorite-badge">
                <span>{wordWrap(options.location)}</span>
              </div>
            </div>
            <div className="card-image-container">
              <div className="image-scroller">
                <div className="image-wrapper">
                  <img
                    src={options.image}
                    alt={options.title}
                    className="card-img-top"
                  />
                </div>
              </div>
            </div>
            <div className="card-content card-body">
              <div className="listing-info">
                <h5 className="card-title">{options.title}</h5>
                <div className="listing-subtitle mb-2">
                  <small className="text-muted">Stay with {options.host}</small>
                  <br />
                  <small className="text-muted">
                    Hosting for {options.years} years
                  </small>
                </div>
                <div className="listing-location mb-2">{options.location}</div>
                <div className="price-info">
                  <div className="price">
                    <span className="text-decoration-line-through me-2">
                      ₹{calculatePrice(options.price, 10)}
                    </span>
                    <span>
                      ₹{options.price} for {options.nights} nights
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomCard;

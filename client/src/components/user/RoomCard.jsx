import { useNavigate } from "react-router-dom";
import { format } from "date-fns";


const RoomCard = ({ roomId, state, city, imageSrc, host, price, type }) => {
  const navigate = useNavigate();

  const calculatePrice = (price, percent) => {
    price = parseInt(price);
    const result = price + price * (percent / 100);
    return result.toFixed(0);
  };

  const handleCardClick = () => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 room-card" onClick={handleCardClick}>
        {/* Image */}
        <div className="room-image-wrapper position-relative">
          <div className="ratio ratio-4x3">
            <img src={imageSrc} alt="room" className="object-cover w-100 h-100" />
          </div>
          {/* Price Tag Overlay */}
          <span className="badge room-badge position-absolute top-0 end-0 m-2">
            ₹{price}/night
          </span>
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h6 className="room-title mb-1">
              {`${type.charAt(0).toUpperCase() + type.slice(1)} in ${city}, ${state}`}
            </h6>
            <p className="text-muted small mb-1">
              Hosted by{" "}
              <span className="fw-semibold text-dark">
                {host?.[0]?.firstName || "a host"}
              </span>
            </p>
            <p className="text-muted small mb-2">
              Hosting since{" "}
              {host?.[0]?.createdOn
                ? format(new Date(host[0].createdOn), "MMM yyyy")
                : "N/A"}
            </p>
          </div>

          {/* Price Section */}
          <div className="fw-bold mt-2">
            <span className="small text-muted text-decoration-line-through me-2">
              ₹{calculatePrice(price, 10)}
            </span>
            <span className="room-price">₹{price}</span>
            <span className="fw-normal text-muted"> / night</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
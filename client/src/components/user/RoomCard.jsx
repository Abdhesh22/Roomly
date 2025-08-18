import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const RoomCard = ({ roomId, title, description, state, city, imageSrc, host, price, type }) => {
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
      <div
        className="card border-0 h-100 shadow-sm card-hover"
        onClick={handleCardClick}
      >
        {/* Image */}
        <div className="room-image-wrapper">
          <div className="ratio ratio-4x3">
            <img
              src={imageSrc}
              alt="room"
              className="room-image"
            />
          </div>
        </div>

        {/* Content */}
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h6 className="fw-bold mb-1">
              {title.length > 40 ? `${title.slice(0, 40)}...` : title}
            </h6>
            <h6 className="fw-bold mb-1">
              {`${type.charAt(0).toUpperCase() + type.slice(1)} in ${city}, ${state}`}
            </h6>
            <p className="text-muted small mb-1">
              Stay with {host?.[0]?.firstName || "a host"}
            </p>
            <p className="text-muted small mb-2">
              Hosting Since {host?.[0]?.createdOn ? format(new Date(host[0].createdOn), "dd/MM/yyyy") : "N/A"}
            </p>
            <p className="text-truncate" title={description}>
              {description.length > 80 ? description.substring(0, 80) + "..." : description}
            </p>
          </div>
          <div>
            <div className="small text-muted text-decoration-line-through">
              ₹{calculatePrice(price, 10)}
            </div>
            <div className="fw-bold text-dark">
              ₹{price} <span className="fw-normal text-muted">/ night</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default RoomCard;

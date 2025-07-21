import "../../assets/style/Room.css";
import { useNavigate } from "react-router-dom";
import Amenities from "./Amenities/Amenities";

const Room = () => {
  const navigate = useNavigate();
  const images = [
    {
      id: 1,
      alt: "Room in Satri",
      host: "Sunder",
      years: 10,
      location: "Room with a view in Binsar Wildlife Sanctuary",
      price: 9900,
      nights: 5,
      src: "https://a0.muscache.com/im/pictures/miso/Hosting-44546056/original/debdcef5-2000-4f9e-baba-bf939effcad6.jpeg?im_w=720",
    },
    {
      id: 2,
      alt: "Cozy Room in Jaipur",
      host: "Priya",
      years: 5,
      location: "Near Amber Fort, Jaipur",
      price: 7500,
      nights: 3,
      src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/2a/6e/96/caption.jpg?w=1400&h=-1&s=1",
    },
    {
      id: 3,
      alt: "Hill View Cottage",
      host: "Ravi",
      years: 2,
      location: "Nainital Hillside Stay",
      price: 8200,
      nights: 4,
      src: "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-jaipur-rajasthan-2-attr-hero?qlt=82&ts=1742161239064",
    },
    {
      id: 4,
      alt: "Cozy Room in Jaipur",
      host: "Priya",
      years: 5,
      location: "Near Amber Fort, Jaipur",
      price: 7500,
      nights: 3,
      src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/2a/6e/96/caption.jpg?w=1400&h=-1&s=1",
    },
    {
      id: 5,
      alt: "Hill View Cottage",
      host: "Ravi",
      years: 2,
      location: "Nainital Hillside Stay",
      price: 8200,
      nights: 4,
      src: "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-jaipur-rajasthan-2-attr-hero?qlt=82&ts=1742161239064",
    },
  ];

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <>
      {/* Main Content */}
      <div className="container mb-5">
        {/* Title */}
        <div className="mb-4">
          <h2>Modern Cozy Apartment in Downtown</h2>
        </div>

        <div className="row g-2 mb-4 image-gallery">
          {/* Column 1: Big image with increased width */}
          <div className="col-md-6">
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="img-fluid rounded cover-img full-height"
            />
          </div>

          {/* Column 2: 2 stacked images */}
          <div className="col-md-3 d-flex flex-column gap-2">
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="img-fluid rounded cover-img half-height"
            />
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="img-fluid rounded cover-img half-height"
            />
          </div>

          {/* Column 3: 2 stacked images */}
          <div className="col-md-3 d-flex flex-column gap-2">
            <img
              src={images[3].src}
              alt={images[3].alt}
              className="img-fluid rounded cover-img half-height"
            />
            <img
              src={images[4].src}
              alt={images[4].alt}
              className="img-fluid rounded cover-img half-height"
            />
          </div>
        </div>

        {/* Info + Booking */}
        <div className="row">
          {/* Left: Room Info */}
          <div className="col-md-8">
            {/* Host */}
            <div className="d-flex align-items-center mb-3">
              <img src="host.jpg" alt="Host" className="host-avatar me-3" />
              <div>
                <h5 className="mb-0">Entire rental unit hosted by John</h5>
                <small>2 guests · 1 bedroom · 1 bed · 1 bath</small>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5>About this place</h5>
              <p>
                This stylish place is perfect for a weekend getaway. Centrally
                located and walkable to restaurants, bars, and attractions.
              </p>
            </div>

            {/* Amenities */}
            <Amenities></Amenities>
          </div>

          {/* Right: Booking Box */}
          <div className="col-md-4">
            <div className="booking-box shadow-sm">
              <h4>
                $120 <small className="text-muted">/ night</small>
              </h4>
              <form>
                <div className="mb-2">
                  <label className="form-label">Check-in</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Check-out</label>
                  <input type="date" className="form-control" />
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => handleNavigate("/checkout/1")}
                >
                  Reserve
                </button>
              </form>
              <p className="mt-2 text-muted small">You won’t be charged yet</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;

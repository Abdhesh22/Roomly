import { useState } from "react";
import Login from "../authentication/Login";

const Checkout = ({ checkin, checkout }) => {
  const [tripDetails, setTripDetails] = useState({
    checkin: "2025-08-08",
    checkout: "2025-08-10",
    guests: 1,
  });

  const [guests, setGuets] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="container py-5">
      <div className="row">
        {/* Left: Booking Details */}
        <div className="col-md-7">
          <h2>Confirm and pay</h2>

          <div className="mb-4">
            <h5>Your trip</h5>

            {/* Check-in */}
            <div className="d-flex justify-content-between align-items-center">
              <span>Check-in</span>
              <div className="d-flex align-items-center gap-2">
                <span>{tripDetails.checkin}</span>
                <i
                  className="bi bi-pencil-fill"
                  role="button"
                  title="Edit check-in"
                ></i>
              </div>
            </div>

            {/* Check-out */}
            <div className="d-flex justify-content-between align-items-center">
              <span>Check-out</span>
              <div className="d-flex align-items-center gap-2">
                <span>{tripDetails.checkout}</span>
                <i
                  className="bi bi-pencil-fill"
                  role="button"
                  title="Edit check-out"
                ></i>
              </div>
            </div>

            {/* Guests */}
            <div className="d-flex justify-content-between align-items-center">
              <span>Guests</span>
              <div className="d-flex align-items-center gap-2">
                <span>{tripDetails.guests}</span>
                <i
                  className="bi bi-pencil-fill"
                  role="button"
                  title="Edit guests"
                ></i>
              </div>
            </div>
          </div>
          <hr />
          {/* Show login form if not logged in */}
          {!isLoggedIn ? (
            <Login></Login>
          ) : (
            <div className="mb-4">
              <h5 className="mb-3">Card Details</h5>
              <div className="mb-3">
                <label>Card Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="row">
                <div className="col">
                  <label>Expiry</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="col">
                  <label>CVV</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123"
                  />
                </div>
              </div>
              <button className="btn btn-success mt-3 w-100">Pay Now</button>
            </div>
          )}
        </div>

        {/* Right: Price Summary with no card, only lines */}
        <div className="col-md-5">
          <div className="p-3 border-top border-bottom">
            <img
              src="https://a0.muscache.com/im/pictures/miso/Hosting-44546056/original/debdcef5-2000-4f9e-baba-bf939effcad6.jpeg?im_w=720"
              alt="Room"
              className="img-fluid rounded mb-3"
            />
            <h6>Modern Cozy Apartment in Downtown</h6>
            <p className="text-muted small">Hosted by John · New York, USA</p>

            <hr />

            <div className="d-flex justify-content-between">
              <span>₹4,500 x 2 nights</span>
              <span>₹9,000</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Cleaning fee</span>
              <span>₹500</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Service fee</span>
              <span>₹1,000</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total (INR)</span>
              <span>₹10,500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

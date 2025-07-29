import { useState, useEffect } from "react";
import Login from "../authentication/Login";
import apiService from "../../utils/request/api.util";
import { loadRazorpayScript } from "../../utils/razorpay/razorpay";
import { toast } from "react-toastify";
import { handleCatch } from "../../utils/common";
import { USER_TYPE } from "../../utils/constants/user-type.constant";

const Reservation = ({ checkinDate, checkoutDate }) => {
  const [tripDetails, setTripDetails] = useState({
    checkin: checkinDate,
    checkout: checkoutDate,
    guests: 1,
  });

  const [guests, setGuets] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkout, setCheckout] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
    }
  }, [])


  const booking = async (order, razorpayResponse) => {
    try {

      const payload = {
        orderId: order.id,
        paymentId: razorpayResponse.paymentId,
        orderSummaryId: order.orderSummaryId,
        razorpaySign: razorpayResponse.razorpay_signature,

      }

      const { data } = await apiService.post("/api/rooms/1/booking", payload);
      if (data.status) {
        toast.success(data.message);
      }

    } catch (error) {
      handleCatch(error);
    }

  }

  const openRazorpay = async (data) => {
    try {

      const res = await loadRazorpayScript();

      if (!res) {
        toast.error("Network Error");
        return;
      }

      const { order, user } = data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Roomly",
        description: "Room Booking Payment",
        order_id: order.id,
        handler: function (res) {
          booking(order, res);
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        },
        theme: {
          color: "#e0484d"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Checkout Error:", error);
    }
  }

  const handleCheckout = async () => {
    const { data } = await apiService.post('/api/user/checkout', {});
    if (data.status) {
      openRazorpay(data);
    }
  }

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
            <Login userType={USER_TYPE.USER} onClose={(value) => setIsLoggedIn(true)} ></Login>
          ) : (<>
            <div className="col-md-12">
              <h2>Cancellation Policy</h2>
              <p><b>Free cancellation before 31 Jul</b>. Cancel before check-in on <b>1 Aug</b> for a partial refund.</p>
            </div>
            <hr />
            <div className="col-md-12">
              <h2>Ground rules</h2>
              <p>We ask every guest to remember a few simple things about what makes a great guest.</p>
              <ul>
                <li><span> Follow the house rules</span></li>
                <li><span>Treat your Host’s home like your own</span></li>
              </ul>
            </div>
            <hr />
            <div className="col-md-12 razorpay-container">
              <p className="razorpay-text">
                <b>Proceed to {" "}</b>
                <img src="/assets/razorpay.svg" alt="Razorpay" className="razorpay-logo" />
              </p>
              <p className="razorpay-text">You will be redirected to Razorpay to complete your payment.</p>
            </div>
            <hr />
            <div className="col-md-12">
              <p className="term-conditions">
                By selecting the button below, I agree to the <b>Host's House Rules, Ground rules for guests, Roomly's Rebooking and Refund Policy </b> and that <b>Roomly</b> can <b>charge my payment method</b> if I’m responsible for damage.
              </p>
              <button onClick={() => handleCheckout(true)} className="btn btn-primary custom-checkout-btn">
                Checkout
              </button>
            </div>
          </>
          )}
        </div>
        <div className="col-md-5">
          <div className="p-3">
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
    </div >
  );
};

export default Reservation;

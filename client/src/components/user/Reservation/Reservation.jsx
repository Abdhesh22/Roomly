import { useState, useContext, useEffect } from "react";
import Login from "../../authentication/Login";
import api from "../../../utils/request/api.util";
import { loadRazorpayScript } from "../../../utils/razorpay/razorpay";
import { toast } from "react-toastify";
import { convertStringToIsoDate, handleCatch } from "../../../utils/common";
import { USER_TYPE } from "../../../utils/constants/user-type.constant";
import TripDetail from "./Trip/TripDetail";
import BillingDetails from "./BillingDetail.jsx";
import { AuthContext } from "../../authentication/AuthContext.jsx";
import { useParams } from "react-router-dom";
import { format, subDays, differenceInCalendarDays } from 'date-fns';
import BackButton from "../../common/CustomComponent/BackButton.jsx";
import SignUp from "../../authentication/Signup.jsx";

const Reservation = () => {

  const { roomId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [guest, setGuest] = useState({});
  const [pricing, setPricing] = useState([]);
  const [room, setRoom] = useState([]);
  const [occupancy, setOccupancy] = useState([]);
  const [billing, setBilling] = useState(null);
  const [excludeDates, setExcludeDates] = useState([]);
  const [showSignup, setShowSignup] = useState(false);
  const [resetTrip, setResetTrip] = useState(false);

  const booking = async (order, razorpayResponse) => {
    try {

      const dates = {
        start: billing.checkin,
        end: billing.checkout
      };

      setExcludeDates((prev) => [...prev, dates]);

      const payload = {
        billingId: order.id,
        paymentId: razorpayResponse.razorpay_payment_id,
        bookingId: order.bookingId,
        razorpaySign: razorpayResponse.razorpay_signature,
        hostId: room.hostId
      };

      const { data } = await api.post(`/api/booking`, payload);

      if (data.status) {
        toast.success(data.message);
        setBilling(null);
        setResetTrip(true);
      } else {
        // Rollback last inserted dates
        setExcludeDates((prev) => prev.slice(0, -1));
      }
    } catch (error) {
      // Rollback on error too
      setExcludeDates((prev) => prev.slice(0, -1));
      handleCatch(error);
    }
  };


  const fetchBlockRanges = async () => {
    try {

      const { data } = await api.get(`/api/rooms/block-ranges/${roomId}`);

      const dates = [];

      for (let i = 0; i < data.ranges.length; i++) {
        const range = data.ranges[i];
        const start = await convertStringToIsoDate(range.startDate);
        const end = await convertStringToIsoDate(range.endDate);
        dates.push({
          start: start,
          end: end,
        })
      }

      setExcludeDates(dates);
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
      handleCatch(error);
    }
  }

  const handleCheckout = async () => {
    try {
      const { data } = await api.post(`/api/booking/checkout`, { roomId: roomId, hostId: room.hostId, billing: { ...billing } });
      if (data.status) {
        openRazorpay(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleCatch(error);
    }

  }

  const onChangeTripDetail = (detail) => {
    setGuest(detail);
  }

  const fetchRoom = async () => {
    try {

      if (!roomId) return;

      const { data } = await api.get(`/api/rooms/detail/${roomId}`);

      const room = data.room;
      setPricing(room.price);
      setOccupancy(room.occupancy);

      setRoom({
        host: `${room.host[0].firstName}`,
        hostId: `${room.hostId}`,
        title: room.title,
        imgSrc: room.attachments[0].remotePath,
        state: room.location.state,
        city: room.location.city,
      })

    } catch (error) {
      handleCatch(error);
    }
  }

  useEffect(() => {
    fetchRoom();
    fetchBlockRanges();
  }, [])

  const getCancellationPolicy = () => {
    const checkinDate = billing.checkin;
    const today = new Date();

    const daysUntilCheckin = differenceInCalendarDays(checkinDate, today);
    if (daysUntilCheckin < 5) {
      return <p>This reservation is <b>non-refundable</b></p>;
    }

    const freeCancelDate = subDays(checkinDate, 5);
    const partialRefundDate = subDays(checkinDate, 4);

    return <p><b>Free cancellation before {format(freeCancelDate, 'd MMM')}</b>. Cancel before check-in on <b>{format(partialRefundDate, 'd MMM')}</b> for a partial refund.</p>;
  };


  return (
    <div className="container">

      <div className="d-flex justify-content-between align-items-center mb-4 room-title">
        {/* Left side: Title */}
        <h2 className="mb-0">Trip Information and Payment</h2>
        {/* Right side: Back + Reservation buttons */}
        <div className="d-flex align-items-center gap-2">
          <BackButton />
        </div>
      </div>


      <div className="row">
        {/* Left: Booking Details */}
        <div className="col-md-7">
          <TripDetail onChange={(value) => onChangeTripDetail(value)} occupancy={occupancy} excludeDates={excludeDates} resetTrip={resetTrip}></TripDetail>
          {/* Show login form if not logged in */}
          {!isLoggedIn && (
            <>
              <hr />
              <Login userType={USER_TYPE.USER} title={"Login Before Checkout"} onClose={() => { }} onSignUp={setShowSignup}></Login>
              <SignUp userType={USER_TYPE.USER} showModal={showSignup} onClose={() => setShowSignup(false)} />
            </>
          )}
          {isLoggedIn && billing?.checkin && billing?.checkout && (<>
            <hr />
            <div className="col-md-12">
              <h2>Cancellation Policy</h2>
              {(getCancellationPolicy())}
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
          </>)
          }
        </div>
        {/**Right: Room Details */}
        <div className="col-md-5">
          <BillingDetails occupancy={guest} pricing={pricing} room={room} billing={billing} setBilling={setBilling} />
        </div>
      </div>
    </div >
  );
};

export default Reservation;

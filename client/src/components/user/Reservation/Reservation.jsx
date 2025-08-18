import { useState, useContext, useEffect } from "react";
import Login from "../../authentication/Login";
import api from "../../../utils/request/api.util";
import { loadRazorpayScript } from "../../../utils/razorpay/razorpay";
import { toast } from "react-toastify";
import { handleCatch } from "../../../utils/common";
import { USER_TYPE } from "../../../utils/constants/user-type.constant";
import TripDetail from "./Trip/TripDetail";
import BillingDetails from "./BillingDetail.jsx";
import { AuthContext } from "../../authentication/AuthContext.jsx";
import { useParams } from "react-router-dom";
import { format, subDays, differenceInCalendarDays } from 'date-fns';

const Reservation = () => {

  const { roomId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [guest, setGuest] = useState({});
  const [pricing, setPricing] = useState([]);
  const [room, setRoom] = useState([]);
  const [occupancy, setOccupancy] = useState([]);
  const [billing, setBilling] = useState(null);

  const booking = async (order, razorpayResponse) => {
    try {

      const payload = {
        billingId: order.id,
        paymentId: razorpayResponse.razorpay_payment_id,
        bookingId: order.bookingId,
        razorpaySign: razorpayResponse.razorpay_signature,
        hostId: room.hostId
      }

      const { data } = await api.post(`/api/rooms/${roomId}/booking`, payload);
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
      handleCatch(error);
    }
  }

  const handleCheckout = async () => {
    const { data } = await api.post(`/api/booking/checkout/`, { roomId: roomId, hostId: room.hostId, billing: { ...billing } });
    if (data.status) {
      openRazorpay(data);
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
      <div className="row">
        {/* Left: Booking Details */}
        <div className="col-md-7">
          <TripDetail onChange={(value) => onChangeTripDetail(value)} occupancy={occupancy}></TripDetail>
          {/* Show login form if not logged in */}
          {!isLoggedIn && (
            <>
              <hr />
              <Login userType={USER_TYPE.USER} title={"Login Before Checkout"} onClose={() => { }}></Login>

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

import { useEffect } from "react";

const BillingDetail = ({ occupancy, pricing, room, billing, setBilling }) => {

    const calculateBilling = (occupancy) => {
        if (!occupancy || !pricing) return;

        const {
            adults = 0,
            teens = 0,
            infants = 0,
            pets = 0,
            checkin,
            checkout
        } = occupancy;

        const {
            base: basePrice = 0,
            guest: extraGuestPrice = 0,
            pet: petPrice = 0,
            teens: teenPrice = 0,
            cleaning,
        } = pricing;

        const adultsNum = Number(adults) || 0;
        const teenNum = Number(teens) || 0;
        const infantsNum = Number(infants) || 0;
        const petsNum = Number(pets) || 0;

        const basePriceNum = Number(basePrice) || 0;
        const extraGuestPriceNum = Number(extraGuestPrice) || 0;
        const petPriceNum = Number(petPrice) || 0;
        const cleaningFeeNum = Number(cleaning) || 0;
        const serviceRateNum = 0.10;
        const teenRateNum = Number(teenPrice);

        let nights = 1;
        if (checkin && checkout) {
            const diffTime = new Date(checkout) - new Date(checkin);
            nights = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
        }

        const extraAdultCount = Math.max(0, adultsNum - 2);
        const gstRate = basePriceNum > 7000 ? 0.18 : 0.12;

        const baseCharge = basePriceNum * nights;
        const extraAdultCharge = extraAdultCount * extraGuestPriceNum * nights;
        const teenCharge = teenNum * teenRateNum * nights;
        const petCharge = petsNum * petPriceNum * nights;

        const subtotal = baseCharge + extraAdultCharge + teenCharge + petCharge + cleaningFeeNum;

        const serviceCharge = subtotal * serviceRateNum;
        const gst = (subtotal + serviceCharge) * gstRate;
        const total = subtotal + serviceCharge + gst;

        const result = {
            checkin,
            checkout,
            nights,
            infantsNum,
            basePrice: basePriceNum,
            baseCharge,
            extraAdultCount,
            extraAdultRate: extraGuestPriceNum,
            extraAdultCharge,
            teenCount: teenNum,
            teenRate: teenRateNum,
            teenCharge: teenCharge,
            petCount: petsNum,
            petRate: petPriceNum,
            petCharge,
            cleaningFee: cleaningFeeNum,
            serviceCharge,
            serviceRate: serviceRateNum,
            gst,
            gstRate,
            total
        };

        setBilling(result);
    };

    useEffect(() => {
        calculateBilling(occupancy);
    }, [occupancy, pricing]);

    if (!billing) return null;

    // ✅ Full billing details if checkin & checkout exist
    const breakdowns = {
        extraAdults: {
            text: `Extra adults (₹${billing.extraAdultRate} × ${billing.extraAdultCount} adult${billing.extraAdultCount !== 1 ? 's' : ''} × ${billing.nights} night${billing.nights !== 1 ? 's' : ''})`,
            total: billing.extraAdultRate * billing.extraAdultCount * billing.nights
        },
        teens: {
            text: `Teens (₹${billing.teenRate} × ${billing.teenCount} teen${billing.teenCount !== 1 ? 's' : ''} × ${billing.nights} night${billing.nights !== 1 ? 's' : ''})`,
            total: billing.teenRate * billing.teenCount * billing.nights
        },
        pets: {
            text: `Pets (₹${billing.petRate} × ${billing.petCount} pet${billing.petCount !== 1 ? 's' : ''} × ${billing.nights} night${billing.nights !== 1 ? 's' : ''})`,
            total: billing.petRate * billing.petCount * billing.nights
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow-sm border">
            {/* Header */}
            <div className="mb-3">
                <img
                    src={room.imgSrc}
                    alt="Room"
                    className="w-100 rounded mb-2"
                />
                <h5 className="mb-0 fw-bold">{room.title}</h5>
                <p className="text-muted small">Hosted by {room.host} · {room.city}, {room.state}</p>
            </div>

            {/* Stay Charges */}
            <div className="mb-3">
                <h6 className="fw-semibold mb-2">Stay Charges</h6>
                <div className="d-flex justify-content-between small">
                    <span className="text-muted">Base rate (₹{billing.basePrice} × {billing.nights} nights)</span>
                    <span className="fw-semibold">₹{billing.baseCharge.toLocaleString()}</span>
                </div>

                {billing.extraAdultCount > 0 && (
                    <div className="d-flex justify-content-between small mt-1">
                        <span className="text-muted">{breakdowns.extraAdults.text}</span>
                        <span>₹{breakdowns.extraAdults.total.toLocaleString()}</span>
                    </div>
                )}

                {billing.teenCount > 0 && (
                    <div className="d-flex justify-content-between small mt-1">
                        <span className="text-muted">{breakdowns.teens.text}</span>
                        <span>₹{breakdowns.teens.total.toLocaleString()}</span>
                    </div>
                )}

                {billing.petCount > 0 && (
                    <div className="d-flex justify-content-between small mt-1">
                        <span className="text-muted">{breakdowns.pets.text}</span>
                        <span>₹{breakdowns.pets.total.toLocaleString()}</span>
                    </div>
                )}

                {billing.infantsNum > 0 && (
                    <div className="d-flex justify-content-between small text-success mt-1">
                        <span>Infants</span>
                        <span>Free</span>
                    </div>
                )}
            </div>

            {/* One-Time Fees */}
            <div className="p-2 rounded bg-light mb-3">
                <h6 className="fw-semibold mb-2">One-Time Fees</h6>
                {billing.cleaningFee > 0 && (
                    <div className="d-flex justify-content-between small">
                        <span className="text-muted">Cleaning fee</span>
                        <span>₹{billing.cleaningFee.toLocaleString()}</span>
                    </div>
                )}
                {billing.serviceCharge > 0 && (
                    <div className="d-flex justify-content-between small mt-1">
                        <span className="text-muted">Service fee ({(billing.serviceRate * 100).toFixed(0)}%)</span>
                        <span>₹{billing.serviceCharge.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* Taxes */}
            <div className="p-2 rounded bg-light mb-3">
                <h6 className="fw-semibold mb-2">Taxes</h6>
                <div className="d-flex justify-content-between small">
                    <span className="text-muted">GST ({(billing.gstRate * 100).toFixed(0)}%)</span>
                    <span>₹{billing.gst.toFixed(2)}</span>
                </div>
            </div>

            {/* Final Total */}
            <div className="p-3 rounded bg-success bg-opacity-10 border border-success">
                <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total (INR)</span>
                    <span>₹{billing.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-muted small mt-1 mb-0">
                    Charges are calculated per night for extra adults, teens, and pets.
                    One-time fees and GST are applied at the end.
                </p>
            </div>
        </div>
    );
};

export default BillingDetail;
const BillingBreakdown = ({ bookingDetails, highlight }) => {
    const {
        basePrice,
        nights,
        baseCharge,
        extraAdultCount,
        extraAdultCharge,
        childCount,
        childCharge,
        petCount,
        petCharge,
        infantsNum,
        cleaningFee,
        serviceCharge,
        serviceRate,
        gst,
        gstRate,
        total,
    } = bookingDetails;

    return (
        <div className="p-3 bg-white rounded border shadow-sm">
            {/* Stay Charges */}
            <h6 className="fw-semibold mb-2">Stay Charges</h6>
            <div className="d-flex justify-content-between small">
                <span className="text-muted">Base rate (₹{basePrice} × {nights} nights)</span>
                <span className={highlight?.base ? "fw-bold text-danger" : ""}>
                    ₹{baseCharge.toLocaleString()}
                </span>
            </div>

            {extraAdultCount > 0 && (
                <div className="d-flex justify-content-between small mt-1">
                    <span className="text-muted">Extra adults</span>
                    <span className={highlight?.extraAdults ? "fw-bold text-danger" : ""}>
                        ₹{extraAdultCharge.toLocaleString()}
                    </span>
                </div>
            )}

            {childCount > 0 && (
                <div className="d-flex justify-content-between small mt-1">
                    <span className="text-muted">Children</span>
                    <span className={highlight?.children ? "fw-bold text-danger" : ""}>
                        ₹{childCharge.toLocaleString()}
                    </span>
                </div>
            )}

            {petCount > 0 && (
                <div className="d-flex justify-content-between small mt-1">
                    <span className="text-muted">Pets</span>
                    <span className={highlight?.pets ? "fw-bold text-danger" : ""}>
                        ₹{petCharge.toLocaleString()}
                    </span>
                </div>
            )}

            {infantsNum > 0 && (
                <div className="d-flex justify-content-between small text-success mt-1">
                    <span>Infants</span>
                    <span>Free</span>
                </div>
            )}

            {/* One-Time Fees */}
            <h6 className="fw-semibold mt-3 mb-2">One-Time Fees</h6>
            {cleaningFee > 0 && (
                <div className="d-flex justify-content-between small">
                    <span className="text-muted">Cleaning fee</span>
                    <span>₹{cleaningFee.toLocaleString()}</span>
                </div>
            )}
            {serviceCharge > 0 && (
                <div className="d-flex justify-content-between small mt-1">
                    <span className="text-muted">Service fee ({(serviceRate * 100).toFixed(0)}%)</span>
                    <span>₹{serviceCharge.toFixed(2)}</span>
                </div>
            )}

            {/* Taxes */}
            <h6 className="fw-semibold mt-3 mb-2">Taxes</h6>
            <div className="d-flex justify-content-between small">
                <span className="text-muted">GST ({(gstRate * 100).toFixed(0)}%)</span>
                <span>₹{gst.toFixed(2)}</span>
            </div>

            {/* Final Total */}
            <div className="p-2 rounded bg-success bg-opacity-10 border border-success mt-3">
                <div className="d-flex justify-content-between fw-bold">
                    <span>Total (INR)</span>
                    <span>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    );
};

export default BillingBreakdown;
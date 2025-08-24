import { useState, useEffect } from "react";
import CustomDatePicker from "../../../common/CustomComponent/CustomDatePicker/CustomDatePicker";
import { addMonthsToNow } from "../../../../utils/common";
import { isWithinInterval } from "date-fns";

const TripDetail = ({ onChange, occupancy, excludeDates, resetTrip }) => {

    const [checkin, setCheckin] = useState(null);
    const [checkout, setCheckout] = useState(null);
    const [adults, setAdults] = useState(2);
    const [teens, setTeens] = useState(0);
    const [infants, setInfants] = useState(0);
    const [pets, setPets] = useState(0);
    const [totalGuests, setTotalGuests] = useState(1);
    const [maxDate, setMaxDate] = useState(null);

    const getMaxDate = async () => {
        setMaxDate(await addMonthsToNow(6));
    }

    useEffect(() => {
        setTotalGuests(adults + teens);
    }, [adults, teens]);

    useEffect(() => {
        onChange({
            adults,
            teens,
            infants,
            pets,
            checkin,
            checkout
        });
    }, [adults, teens, infants, pets, checkin, checkout]);

    useEffect(() => {
        getMaxDate();
    }, [])

    useEffect(() => {
        if (resetTrip) {
            setCheckin(null);
            setCheckout(null);
        }
    }, [resetTrip]);

    useEffect(() => {
        if (checkin && checkout && excludeDates?.length) {
            // Check if any excluded interval lies between checkin & checkout
            const invalid = excludeDates.some(({ start, end }) =>
                isWithinInterval(start, { start: checkin, end: checkout }) ||
                isWithinInterval(end, { start: checkin, end: checkout })
            );
            if (invalid) {
                setCheckout(checkin);
            }
        }
    }, [checkin, checkout, excludeDates]);

    return (
        <div className="p-4">
            <p className="mb-4 text-muted">
                <span className="color-red">Note: </span> Please review and complete your trip details before proceeding to payment.
                This includes selecting your check-in and check-out dates, and specifying
                the total number of guests.
            </p>

            {/* Date Pickers */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label fw-semibold m-2">Check-in</label>
                    <CustomDatePicker
                        selectedDate={checkin}
                        onChange={setCheckin}
                        minDate={new Date()}
                        className="form-control"
                        maxDate={checkout || maxDate}
                        excludeDateIntervals={excludeDates}
                        placeholder="Select check-in date"
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold m-2">Check-out</label>
                    <CustomDatePicker
                        selectedDate={checkout}
                        onChange={setCheckout}
                        className="form-control"
                        minDate={checkin || new Date()}
                        maxDate={maxDate}
                        excludeDateIntervals={excludeDates}
                        placeholder="Select check-out date"
                    />
                </div>
            </div>

            {/* Total Guests */}
            <div className="mb-4">
                <label className="form-label fw-semibold">Total Guests</label>
                <input
                    type="text"
                    value={totalGuests}
                    className="form-control bg-light"
                    disabled
                />
            </div>

            {/* Guest Details */}
            <div className="mb-3">
                <label className="form-label fw-semibold mb-2">Guest Breakdown</label>
                <div className="d-flex flex-column gap-3">
                    <GuestRow label="Adults" value={adults} setValue={setAdults} min={0} max={occupancy?.guest} />
                    <GuestRow label="Teens" value={teens} setValue={setTeens} max={occupancy?.guest} />
                    <GuestRow label="Infants" value={infants} setValue={setInfants} max={2} />
                    <GuestRow label="Pets" value={pets} setValue={setPets} max={occupancy?.pet} />
                </div>
            </div>
        </div>
    );
};

// ✅ Reusable guest counter row
const GuestRow = ({ label, value, setValue, min = 0, max = 10000 }) => (
    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
        <span className="fw-medium">{label}</span>
        <div className="d-flex align-items-center gap-2">
            <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-circle"
                style={{ width: "32px", height: "32px" }}
                onClick={() => value > min && setValue(value - 1)}
            >
                -
            </button>
            <span style={{ width: "24px", textAlign: "center" }}>{value}</span>
            <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-circle"
                style={{ width: "32px", height: "32px" }}
                onClick={() => value < max && setValue(value + 1)}
            >
                +
            </button>
        </div>
    </div>
);

export default TripDetail;
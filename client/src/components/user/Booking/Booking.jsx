import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import CustomTable from "../../common/CustomComponent/CustomTable/CustomTable";
import api from "../../../utils/request/api.util";
import { debounce, handleCatch } from "../../../utils/common";
import CustomConfirmationModal from "../../common/CustomComponent/CustomModal/ConfirmationModal";
import { toast } from 'react-toastify';
import MiniCustomModal from "../../common/CustomComponent/CustomModal/MiniCustomModal";
import { BillingStatusLabels, BillingStatus, orderStatusOptions, statusConfig } from "../../../utils/constants/orders.constant";
import CustomMultiSelect from "../../common/CustomComponent/CustomMultiSelect/CustomMultiSelect";
import { format, subDays, isBefore, isEqual } from 'date-fns';
import BillingBreakdown from "./BillingBreakDown";
import BackButton from "../../common/CustomComponent/BackButton";

const RoomFilters = ({ status, setStatus, searchRooms, orderStatusOptions }) => (
    < div className="d-flex justify-content-end align-items-end mb-4 gap-3 flex-wrap" >
        < div className="d-flex flex-column w-100 w-md-50" >
            <label className="form-label fw-semibold text-secondary mb-1">Search</label>
            <div className="input-group shadow-sm rounded-3 overflow-hidden">
                <span className="input-group-text bg-light border-0">
                    <i className="bi bi-search text-muted"></i>
                </span>
                <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search rooms by name, location, etc."
                    onInput={(e) => searchRooms(e.target.value)} />
            </div>
        </div >

        < div className="d-flex flex-column w-100 w-md-25" >
            <label className="form-label fw-semibold text-secondary mb-1">Status</label>
            <div className="shadow-sm rounded-3 custom-multiselect-container">
                <CustomMultiSelect
                    options={orderStatusOptions}
                    value={[status]}
                    onChange={(value) => setStatus(value)}
                    isMulti={false}
                />
            </div>
        </div >
    </div >
);

const UserBooking = () => {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        searchKey: "",
        status: orderStatusOptions[0],
        sortKey: "createdOn",
        sortOrder: "asc",
    });
    const [total, setTotal] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    const [modalData, setModalData] = useState({
        title: "",
        message: null,
        size: "lg",
        confirmText: "Confirm",
        onConfirm: () => { },
    });

    const columns = [
        { header: "Booking Number", accessor: "receipt" },
        { header: "Title", accessor: "title" },
        { header: "Status", accessor: "statusLabel" },
        { header: "Total Amount", accessor: "totalBilling" },
        { header: "City", accessor: "city" },
        { header: "Pincode", accessor: "pincode" },
    ];

    // --- Actions ---
    const getActions = useCallback((row) => {
        const actions = [
            {
                label: () => (
                    <span className="text-primary" title="View">
                        <i className="bi bi-eye me-1" />
                    </span>
                ),
                onClick: () => navigate(`/user/rooms/view/${row.roomId}`),
            },
            {
                label: () => (
                    <span className="text-primary" title="View billing details">
                        <i className="bi bi-receipt" />
                    </span>
                ),
                onClick: () => {
                    setBookingDetails(row.bookingDetails);
                    setShowBillingModal(true);
                },
            },
            {
                label: () => (
                    <span className="text-info" title="View Timeline">
                        <i className="bi bi-clock-history" />
                    </span>
                ),
                onClick: () => {
                    console.log(row);
                    setModalData({
                        title: "Booking Timeline",
                        message: (
                            <div className="timeline-container">
                                <ul className="timeline-list">
                                    {row.timeline?.map((event, index) => {
                                        const isLast = index === row.timeline.length - 1;
                                        const cfg = statusConfig[event.status] || {
                                            icon: "bi-circle-fill",
                                            class: "timeline-muted",
                                        };

                                        return (
                                            <li key={index} className="timeline-item">
                                                {/* Connector Line */}
                                                {!isLast && <div className="timeline-line" />}

                                                {/* Marker */}
                                                <div className={`timeline-marker ${cfg.class}`}>
                                                    <i className={`bi ${cfg.icon}`} />
                                                </div>

                                                {/* Content */}
                                                <div className="timeline-content">
                                                    <div className="timeline-title">{BillingStatusLabels[event.status]}</div>
                                                    <small className="timeline-date">
                                                        {format(new Date(event.createdAt), "d MMM, h:mm:ss a")}
                                                    </small>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ),
                        size: 'sm',
                        confirmText: false,
                        onConfirm: () => setShowConfirm(false),
                    });
                    setShowConfirm(true);
                },
            }
        ];



        switch (row.status) {
            case BillingStatus.PAYMENT_DONE:
                const checkinDate = new Date(row.bookingDetails.checkin);

                const freeCancelDate = subDays(checkinDate, 5);
                const partialRefundDate = subDays(checkinDate, 4);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let refundMessage = null;
                let refundStatus = 0;

                // --- Refund Policy Handling ---
                if (isBefore(today, freeCancelDate) || isEqual(today, freeCancelDate)) {
                    // ✅ Full Refund
                    const refund = row.bookingDetails.total; // full amount refunded

                    refundMessage = (
                        <li className="refund-note mb-2 p-3 border rounded bg-light">
                            <div className="fw-bold text-success mb-1">
                                <i className="bi bi-check-circle me-1"></i>
                                Full Refund Policy
                            </div>
                            <BillingBreakdown bookingDetails={row.bookingDetails} />
                            <div className="mt-2 small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Refunded Amount</span>
                                    <span className="fw-bold text-success">₹{refund.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Charged Amount</span>
                                    <span className="fw-bold text-danger">₹0.00</span>
                                </div>
                            </div>
                            <small className="text-muted d-block mt-1">
                                Free cancellation valid until {format(freeCancelDate, "d MMM")}.
                            </small>
                        </li>
                    );

                    refundStatus = 1;
                }
                else if (isBefore(today, partialRefundDate) || isEqual(today, partialRefundDate)) {
                    // ✅ Partial Refund
                    const firstNightCharge =
                        row.bookingDetails.basePrice +
                        (row.bookingDetails.extraAdultRate * row.bookingDetails.extraAdultCount) +
                        (row.bookingDetails.teenRate * row.bookingDetails.teenCount) +
                        (row.bookingDetails.petRate * row.bookingDetails.petCount);

                    const refund = row.bookingDetails.total - firstNightCharge;
                    const charged = firstNightCharge;

                    refundMessage = (
                        <li className="refund-note mb-2 p-3 border rounded bg-light">
                            <div className="fw-bold text-warning mb-1">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                Partial Refund Policy
                            </div>
                            <BillingBreakdown
                                bookingDetails={row.bookingDetails}
                                highlight={{ base: true, extraAdults: true, teens: true, pets: true }}
                            />
                            <div className="mt-2 small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Refunded Amount</span>
                                    <span className="fw-bold text-success">₹{refund.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Charged Amount</span>
                                    <span className="fw-bold text-danger">₹{charged.toFixed(2)}</span>
                                </div>
                            </div>
                            <p className="text-danger small mt-2">
                                Charged: 1st night stay (base + guests).
                                Refund includes cleaning fee, service fee, GST, and remaining nights.
                            </p>
                            <small className="text-muted d-block mt-1">
                                Partial refund valid until {format(partialRefundDate, "d MMM")}.
                            </small>
                        </li>
                    );

                    refundStatus = 2;
                }
                // ❌ No Refund (after partialRefundDate)
                else {
                    const charged = row.bookingDetails.total;
                    const refund = 0;

                    refundMessage = (
                        <li className="refund-note mb-2 p-3 border rounded bg-light">
                            <div className="fw-bold text-danger mb-1">
                                <i className="bi bi-x-circle me-1"></i>
                                No Refund Policy
                            </div>
                            <BillingBreakdown bookingDetails={row.bookingDetails} />
                            <div className="mt-2 small">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Refunded Amount</span>
                                    <span className="fw-bold text-success">₹{refund.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Charged Amount</span>
                                    <span className="fw-bold text-danger">₹{charged.toFixed(2)}</span>
                                </div>
                            </div>
                            <p className="text-danger small mt-2">
                                No refund applicable — full amount charged.
                            </p>
                        </li>
                    );

                    refundStatus = 3;
                }

                actions.push({
                    label: () => (
                        <span className="text-danger" title="Cancel this booking">
                            <i className="bi bi-x-circle" />
                        </span>
                    ),
                    onClick: () => {
                        setModalData({
                            title: "Cancel Booking",
                            message: (
                                <>
                                    <p>Are you sure you want to cancel your booking?</p>
                                    <ul className="modal-notes list-unstyled ps-0 mt-3">
                                        {refundMessage}
                                        <li className="warning-note">
                                            <i className="bi bi-exclamation-triangle me-1"></i>
                                            This action cannot be undone.
                                        </li>
                                    </ul>
                                </>
                            ),
                            size: "lg",
                            confirmText: "Yes, cancel my booking",
                            onConfirm: () => handleCancelBooking(row, refundStatus),
                        });
                        setShowConfirm(true);
                    },
                });
                break;

        }


        return actions;
    }, [navigate]);


    // --- Fetch Rooms ---
    const fetchBookings = useCallback(async () => {
        try {
            const { data } = await api.get("/api/booking/user-booking", {
                skip: filters.page,
                limit: filters.limit,
                sortKey: filters.sortKey,
                order: filters.sortOrder,
                searchKey: filters.searchKey,
                status: filters.status.value,
            });

            const list = data.list.map(({ _id, bookingDetails, room, hostId, status, receipt, timeline }) => ({
                billingId: _id,
                receipt: receipt || '--',
                bookingDetails,
                totalBilling: bookingDetails.total,
                title: room.title,
                hostId,
                timeline: timeline,
                status,
                statusLabel: BillingStatusLabels[status],
                city: room.location.city,
                roomId: room._id,
                pincode: room.location.pincode
            }));

            if (data.status) {
                setTotal(data.total || list.length);
                setRooms(list);
            }
        } catch (error) {
            handleCatch(error);
        }
    }, [filters]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const searchRooms = debounce((value) => {
        setFilters(prev => ({ ...prev, searchKey: value, page: 1 }));
    }, 500);

    const pagination = {
        page: filters.page,
        limit: filters.limit,
        total,
        onPageChange: (newPage) => setFilters(prev => ({ ...prev, page: newPage })),
    };

    const cancelConfirm = () => setShowConfirm(false);
    const closeBillingModal = () => { setShowBillingModal(false); setBookingDetails(null); }

    const handleCancelBooking = async (row, refundStatus) => {
        try {
            const { data } = await api.post("/api/booking/cancel-by-user", { billingId: row.billingId, refundStatus });
            if (data.status) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
            setShowConfirm(false);
            fetchBookings();
        } catch (error) {
            handleCatch(error);
        }
    }

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4 room-title">
                    {/* Left side: Title */}
                    <h2 className="mb-0">Trips</h2>
                    {/* Right side: Back + Reservation buttons */}
                    <div className="d-flex align-items-center gap-2">
                        <BackButton />
                    </div>
                </div>

                {/* Filters */}
                <RoomFilters
                    status={filters.status}
                    setStatus={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    searchRooms={searchRooms}
                    orderStatusOptions={orderStatusOptions}
                />

                {/* Table */}
                <CustomTable
                    columns={columns}
                    data={rooms}
                    enableSorting={true}
                    actions={getActions}
                    pagination={pagination}
                    sortTable={(key, order) => setFilters(prev => ({ ...prev, sortKey: key, sortOrder: order }))}
                />

                {/* Confirmation Modal */}
                <CustomConfirmationModal
                    show={showConfirm}
                    title={modalData.title}
                    message={modalData.message}
                    onConfirm={() => modalData.onConfirm?.()}
                    onCancel={cancelConfirm}
                    confirmText={modalData.confirmText}
                    cancelText="Cancel"
                    size={modalData.size}
                    isHtml={false} // now we use JSX directly
                />

                {/* Billing Modal */}
                {showBillingModal && (
                    <MiniCustomModal
                        show={showBillingModal}
                        onClose={closeBillingModal}
                        title="Billing Details"
                        modalClass="modal-dialog modal-dialog-centered modal-lg"
                        footer={({ handleClose }) => (
                            <>
                                <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                            </>
                        )}
                    >
                        {bookingDetails && (
                            <div className="space-y-3">
                                <table className="table table-sm table-bordered mb-0 w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <th>Check-in</th>
                                            <td>{new Date(bookingDetails.checkin).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <th>Check-out</th>
                                            <td>{new Date(bookingDetails.checkout).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <th>Nights</th>
                                            <td>{bookingDetails.nights}</td>
                                        </tr>
                                        <tr>
                                            <th>Base Price (2 Guests including Tenant)</th>
                                            <td>
                                                ₹{bookingDetails.basePrice}
                                                <span className="text-muted ms-2">
                                                    (1 tenant + 1 guest)
                                                </span>
                                            </td>
                                        </tr>
                                        {bookingDetails.extraAdultCount > 0 && (
                                            <tr>
                                                <th>
                                                    Extra Adults ({bookingDetails.extraAdultCount} × ₹{bookingDetails.extraAdultRate})
                                                </th>
                                                <td>₹{bookingDetails.extraAdultCharge}</td>
                                            </tr>
                                        )}
                                        {bookingDetails.teenCount > 0 && (
                                            <tr>
                                                <th>
                                                    Teens ({bookingDetails.teenCount} × ₹{bookingDetails.teenRate})
                                                </th>
                                                <td>₹{bookingDetails.teenCharge}</td>
                                            </tr>
                                        )}
                                        {bookingDetails.petCount > 0 && (
                                            <tr>
                                                <th>
                                                    Pets ({bookingDetails.petCount} × ₹{bookingDetails.petRate})
                                                </th>
                                                <td>₹{bookingDetails.petCharge}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <th>Cleaning Fee</th>
                                            <td>₹{bookingDetails.cleaningFee}</td>
                                        </tr>
                                        <tr>
                                            <th>Service Charge</th>
                                            <td>₹{bookingDetails.serviceCharge}</td>
                                        </tr>
                                        <tr>
                                            <th>GST</th>
                                            <td>₹{bookingDetails.gst} ({bookingDetails.gstRate * 100}%)</td>
                                        </tr>
                                        <tr className="fw-bold">
                                            <th>Total</th>
                                            <td>₹{bookingDetails.total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}


                    </MiniCustomModal>
                )}
            </div>
        </>
    );
};

export default UserBooking;
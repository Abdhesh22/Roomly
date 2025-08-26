import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import CustomTable from "../common/CustomComponent/CustomTable/CustomTable";
import api from "../../utils/request/api.util";
import { debounce, handleCatch } from "../../utils/common";
import CustomConfirmationModal from "../common/CustomComponent/CustomModal/ConfirmationModal";
import { toast } from 'react-toastify';
import MiniCustomModal from "../common/CustomComponent/CustomModal/MiniCustomModal";
import { BillingStatusLabels, BillingStatus, orderStatusOptions, statusConfig } from "../../utils/constants/orders.constant";
import CustomMultiSelect from "../common/CustomComponent/CustomMultiSelect/CustomMultiSelect";
import { format } from 'date-fns';
import BackButton from "../common/CustomComponent/BackButton";
import Loader from "../common/CustomComponent/Loader";

// --- Filters Component ---
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

const HostBooking = () => {
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
    const [loader, setLoader] = useState(true);
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
        { header: "Booked By", accessor: "tenantName" },
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
                onClick: () => navigate(`/host/rooms/view/${row.roomId}`),
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
                actions.push({
                    label: () => (
                        <span className="text-success" title="Confirm this booking">
                            <i className="bi bi-check-circle" />
                        </span>
                    ),
                    onClick: () => {
                        setModalData({
                            title: "Confirm Booking",
                            message: (
                                <>
                                    <p>Are you sure you want to confirm this booking?</p>
                                    <ul className="modal-notes list-unstyled ps-0 mt-3">
                                        <li className="warning-note mb-2">
                                            <i className="bi bi-exclamation-triangle me-1"></i>
                                            This action cannot be undone.
                                        </li>
                                    </ul>
                                </>
                            ),
                            size: 'lg',
                            confirmText: "Yes, Confirm",
                            onConfirm: () => {
                                handleConfirmationBooking(row);
                            },
                        });
                        setShowConfirm(true);
                    },
                });

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
                                    <p>Are you sure you want to cancel this booking?</p>
                                    <ul className="modal-notes list-unstyled ps-0 mt-3">
                                        <li className="refund-note mb-2">
                                            <i className="bi bi-currency-rupee me-1"></i>
                                            The full amount of ₹{row.bookingDetails.total} will be refunded.
                                        </li>
                                        <li className="notification-note mb-2">
                                            <i className="bi bi-bell me-1"></i>
                                            The user will also be notified about this cancellation.
                                        </li>
                                        <li className="rating-note mb-2">
                                            <i className="bi bi-star me-1"></i>
                                            Cancelling may affect your host rating.
                                        </li>
                                        <li className="warning-note">
                                            <i className="bi bi-exclamation-triangle me-1"></i>
                                            This action cannot be undone.
                                        </li>
                                    </ul>
                                </>
                            ),
                            size: 'lg',
                            confirmText: "Yes, cancel",
                            onConfirm: () => handleCancelBooking(row),
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
            const { data } = await api.get("/api/booking", {
                skip: filters.page,
                limit: filters.limit,
                sortKey: filters.sortKey,
                order: filters.sortOrder,
                searchKey: filters.searchKey,
                status: filters.status.value,
            });

            const list = data.list.map(({ _id, bookingDetails, room, tenant, hostId, status, receipt, timeline }) => ({
                billingId: _id,
                userId: tenant._id,
                receipt: receipt || '--',
                bookingDetails,
                totalBilling: bookingDetails.total,
                title: room.title,
                hostId,
                status,
                timeline,
                statusLabel: BillingStatusLabels[status],
                city: room.location.city,
                roomId: room._id,
                pincode: room.location.pincode,
                tenantName: `${tenant.firstName} ${tenant.lastName}`,
            }));

            if (data.status) {
                setTotal(data.length || list.length);
                setRooms(list);
            }
            setLoader(false);
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

    const handleConfirmationBooking = async (row) => {
        try {
            const { data } = await api.post("/api/booking/confirm", { billingId: row.billingId, title: row.title, userId: row.userId, tenantName: row.tenantName });
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
    };

    const handleCancelBooking = async (row) => {
        try {
            const { data } = await api.post("/api/booking/cancel-by-host", { billingId: row.billingId, title: row.title, userId: row.userId, tenantName: row.tenantName });
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
                {loader && <Loader show={loader} message="Loading Reservations..."></Loader>}
                {!loader && <>
                    {/* Title */}
                    <div className="d-flex justify-content-between align-items-center mb-4 room-title">
                        {/* Left side: Title */}
                        <h2 className="mb-0">Reservations</h2>
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
                        size={modalData.size}
                        cancelText="Cancel"
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
                                                <th>Base Price</th>
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
                                                        Teen ({bookingDetails.teenCount} × ₹{bookingDetails.teenRate})
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

                </>}
            </div>
        </>
    );
};

export default HostBooking;
const BillingStatus = {
    PAYMENT_IN_PROGRESS: 1,
    PAYMENT_DONE: 2,
    COMPLETE: 3,
    CONFIRMED: 4,
    FAILED: 5,

    // Full refund
    REFUND_INITIATED: 8,
    REFUND_COMPLETE: 9,
    REFUND_BY_HOST_INITIATED: 13,
    REFUND_BY_HOST_COMPLETE: 14,
    REFUND_BY_USER_INITIATED: 15,
    REFUND_BY_USER_COMPLETE: 16,

    // Partial refund
    REFUND_PARTIAL_INITIATED: 11,
    REFUND_PARTIAL_COMPLETE: 12,
    REFUND_PARTIAL_BY_USER_INITIATED: 19,
    REFUND_PARTIAL_BY_USER_COMPLETE: 20,

    // Booking cancelled without refund
    BOOKING_CANCELLED: 21,

    // Refund in-progress
    REFUND_BY_HOST_PROCEDDED: 22,
    REFUND_PARTIAL_BY_USER_PROCEDDED: 23,
    REFUND_BY_USER_PROCEDDED: 24,
    CHECK_IN: 25,
    CHECK_OUT: 26,

    EXPIRED: 10
};


const RefundStatus = {
    FULL_REFUND: 1,
    PARTIAL_REFUND: 2,
    NO_REFUND: 3,
    HOST_REFUND_FULL_REFUND: 4
}

const orderStatusOptions = {
    ALL: 'all',
    PAYMENT_IN_PROGRESS: "payment_progress",
    PAYMENT_DONE: "payment_done",
    CONFIRMED: "confirmed",
    REFUND: "refund",
    CHECK_IN: 'check_in',
    CHECK_OUT: 'check_out',
    NO_REFUND: "no_refund"
}


const BillingStatusLabels = {
    [BillingStatus.CHECK_IN]: "Checked In",
    [BillingStatus.CHECK_OUT]: "Checked Out"
}

const BookingTime = {
    CHECK_IN_HOUR: 15,
    CHECK_OUT_MINUTE: 0,
    CHECK_OUT_HOUR: 11,
    CHECK_IN_MINUTE: 0,
}

module.exports = {
    BillingStatus,
    orderStatusOptions,
    BillingStatusLabels,
    RefundStatus,
    BookingTime
}
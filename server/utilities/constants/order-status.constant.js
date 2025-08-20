module.exports.BillingStatus = {
    PAYMENT_IN_PROGRESS: 1,
    PAYMENT_DONE: 2,
    COMPLETE: 3,
    CONFIRMED: 4,
    FAILED: 5,

    // Full refund
    REFUND_INITIATED: 8,
    REFUND_COMPLETE: 9,
    EXPIRED: 10,
    REFUND_BY_HOST_INITIATED: 13,
    REFUND_BY_HOST_COMPLETE: 14,
    REFUND_BY_USER_INITIATED: 15,
    REFUND_BY_USER_COMPLETE: 16,

    // Partial refund
    REFUND_PARTIAL_INITIATED: 11,
    REFUND_PARTIAL_COMPLETE: 12,
    REFUND_PARTIAL_BY_USER_INITIATED: 19,
    REFUND_PARTIAL_BY_USER_COMPLETE: 20,

    // Booking Cancelled by without refund
    BOOKING_CANCELLED: 21,

    REFUND_BY_HOST_PROCEDDED: 22,
    REFUND_PARTIAL_BY_USER_PROCEDDED: 23,
    REFUND_BY_USER_PROCEDDED: 24

};


module.exports.RefundStatus = {
    FULL_REFUND: 1,
    PARTIAL_REFUND: 2,
    NO_REFUND: 3,
    HOST_REFUND_FULL_REFUND: 4
}

module.exports.orderStatusOptions = {
    ALL: 'all',
    PAYMENT_IN_PROGRESS: "payment_progress",
    PAYMENT_DONE: "payment_done",
    CONFIRMED: "confirmed",
    REFUND: "refund",
    COMPLETE: 'complete'
}
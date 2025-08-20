export const BillingStatus = {
    PAYMENT_IN_PROGRESS: 1,
    PAYMENT_DONE: 2,
    COMPLETE: 3,
    CONFIRMED: 4,
    FAILED: 5,

    // Full refund
    REFUND_INITIATED: 8, // generic
    REFUND_COMPLETE: 9,  // generic
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

    EXPIRED: 10
};

export const BillingStatusLabels = {
    [BillingStatus.PAYMENT_IN_PROGRESS]: "Payment in Progress",
    [BillingStatus.PAYMENT_DONE]: "Payment Done",
    [BillingStatus.CONFIRMED]: "Confirmed",
    [BillingStatus.COMPLETE]: "Completed",
    [BillingStatus.FAILED]: "Failed",

    // Full refund
    [BillingStatus.REFUND_INITIATED]: "Refund Initiated",
    [BillingStatus.REFUND_COMPLETE]: "Refund Completed",
    [BillingStatus.REFUND_BY_HOST_INITIATED]: "Refund Initiated (Host)",
    [BillingStatus.REFUND_BY_HOST_COMPLETE]: "Refund Completed (Host)",
    [BillingStatus.REFUND_BY_USER_INITIATED]: "Refund Initiated (User)",
    [BillingStatus.REFUND_BY_USER_COMPLETE]: "Refund Completed (User)",
    [BillingStatus.REFUND_BY_HOST_PROCEDDED]: "Refund Processing (Host)",
    [BillingStatus.REFUND_BY_USER_PROCEDDED]: "Refund Processing (User)",

    // Partial refund
    [BillingStatus.REFUND_PARTIAL_INITIATED]: "Partial Refund Initiated",
    [BillingStatus.REFUND_PARTIAL_COMPLETE]: "Partial Refund Completed",
    [BillingStatus.REFUND_PARTIAL_BY_USER_INITIATED]: "Partial Refund Initiated (User)",
    [BillingStatus.REFUND_PARTIAL_BY_USER_COMPLETE]: "Partial Refund Completed (User)",
    [BillingStatus.REFUND_PARTIAL_BY_USER_PROCEDDED]: "Partial Refund Processing (User)",

    // Cancelled / expired
    [BillingStatus.BOOKING_CANCELLED]: "Booking Cancelled",
    [BillingStatus.EXPIRED]: "Payment Expired"
};



export const orderStatusOptions = [
    { label: "All", value: "all" },
    { label: "Payment Progress", value: "payment_progress" },
    { label: "Payment Done", value: "payment_done" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Refund", value: "refund" },
    { label: "Complete", value: "complete" },
];

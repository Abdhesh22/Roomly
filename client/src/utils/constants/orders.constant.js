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
    CHECK_IN: 25,
    CHECK_OUT: 26,

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
    [BillingStatus.EXPIRED]: "Payment Expired",

    [BillingStatus.CHECK_IN]: "Checked In",
    [BillingStatus.CHECK_OUT]: "Checked Out",
};



export const orderStatusOptions = [
    { label: "All", value: "all" },
    { label: "Payment Progress", value: "payment_progress" },
    { label: "Payment Done", value: "payment_done" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Checked In", value: "check_in" },
    { label: "Checked Out", value: "check_out" },
    { label: "Refund", value: "refund" },
    { label: "No Refund", value: 'no_refund' }
];


export const statusConfig = {
    [BillingStatus.PAYMENT_IN_PROGRESS]: { icon: "bi-arrow-repeat", class: "timeline-warning" },
    [BillingStatus.PAYMENT_DONE]: { icon: "bi-credit-card-fill", class: "timeline-success" },
    [BillingStatus.CONFIRMED]: { icon: "bi-check-circle-fill", class: "timeline-success" },
    [BillingStatus.COMPLETE]: { icon: "bi-check2-circle", class: "timeline-success" },
    [BillingStatus.FAILED]: { icon: "bi-x-circle-fill", class: "timeline-danger" },
    [BillingStatus.EXPIRED]: { icon: "bi-hourglass-split", class: "timeline-danger" },

    // Refund flows
    [BillingStatus.REFUND_INITIATED]: { icon: "bi-arrow-counterclockwise", class: "timeline-info" },
    [BillingStatus.REFUND_COMPLETE]: { icon: "bi-cash-stack", class: "timeline-success" },
    [BillingStatus.REFUND_BY_HOST_INITIATED]: { icon: "bi-arrow-counterclockwise", class: "timeline-info" },
    [BillingStatus.REFUND_BY_HOST_COMPLETE]: { icon: "bi-cash-stack", class: "timeline-success" },
    [BillingStatus.REFUND_BY_USER_INITIATED]: { icon: "bi-arrow-counterclockwise", class: "timeline-info" },
    [BillingStatus.REFUND_BY_USER_COMPLETE]: { icon: "bi-cash-stack", class: "timeline-success" },
    [BillingStatus.REFUND_BY_HOST_PROCEDDED]: { icon: "bi-hourglass", class: "timeline-info" },
    [BillingStatus.REFUND_BY_USER_PROCEDDED]: { icon: "bi-hourglass", class: "timeline-info" },

    // Partial refund flows
    [BillingStatus.REFUND_PARTIAL_INITIATED]: { icon: "bi-arrow-counterclockwise", class: "timeline-info" },
    [BillingStatus.REFUND_PARTIAL_COMPLETE]: { icon: "bi-cash-stack", class: "timeline-success" },
    [BillingStatus.REFUND_PARTIAL_BY_USER_INITIATED]: { icon: "bi-arrow-counterclockwise", class: "timeline-info" },
    [BillingStatus.REFUND_PARTIAL_BY_USER_COMPLETE]: { icon: "bi-cash-stack", class: "timeline-success" },
    [BillingStatus.REFUND_PARTIAL_BY_USER_PROCEDDED]: { icon: "bi-hourglass", class: "timeline-info" },

    // Cancelled
    [BillingStatus.BOOKING_CANCELLED]: { icon: "bi-x-octagon-fill", class: "timeline-danger" },
    [BillingStatus.CHECK_IN]: { icon: "bi-box-arrow-in-right", class: "timeline-primary" },
    [BillingStatus.CHECK_OUT]: { icon: "bi-box-arrow-right", class: "timeline-warning" },
};

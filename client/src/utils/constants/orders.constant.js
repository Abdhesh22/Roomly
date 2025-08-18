export const BillingStatus = {
    PAYMENT_IN_PROGRESS: 1,
    PENDING: 2,
    COMPLETE: 3,
    CONFIRMED: 4,
    FAILED: 5,
    CANCELLED_BY_HOST: 6,
    CANCELLED_BY_USER: 7,

    // Full refund
    REFUND_INITIATED: 8, // generic (if needed)
    REFUND_COMPLETE: 9,  // generic (if needed)
    REFUND_BY_HOST_INITIATED: 13,
    REFUND_BY_HOST_COMPLETE: 14,
    REFUND_BY_USER_INITIATED: 15,
    REFUND_BY_USER_COMPLETE: 16,

    // Partial refund
    REFUND_PARTIAL_INITIATED: 11,
    REFUND_PARTIAL_COMPLETE: 12,
    REFUND_PARTIAL_BY_HOST_INITIATED: 17,
    REFUND_PARTIAL_BY_HOST_COMPLETE: 18,
    REFUND_PARTIAL_BY_USER_INITIATED: 19,
    REFUND_PARTIAL_BY_USER_COMPLETE: 20,

    EXPIRED: 10
};

export const getStatusLabel = (status) => {
    switch (parseInt(status)) {
        case BillingStatus.PAYMENT_IN_PROGRESS:
            return 'Payment in Progress';
        case BillingStatus.PENDING:
            return 'Pending';
        case BillingStatus.COMPLETE:
            return 'Complete';
        case BillingStatus.CONFIRMED:
            return 'Confirmed';
        case BillingStatus.FAILED:
            return 'Failed';
        case BillingStatus.CANCELLED_BY_HOST:
            return 'Cancelled by You';
        case BillingStatus.CANCELLED_BY_USER:
            return 'Cancelled by Tenant';

        // Full refund (generic)
        case BillingStatus.REFUND_INITIATED:
            return 'Full Refund Initiated';
        case BillingStatus.REFUND_COMPLETE:
            return 'Full Refund Complete';

        // Full refund (by host/user)
        case BillingStatus.REFUND_BY_HOST_INITIATED:
            return 'Full Refund Initiated by Host';
        case BillingStatus.REFUND_BY_HOST_COMPLETE:
            return 'Full Refund Complete by Host';
        case BillingStatus.REFUND_BY_USER_INITIATED:
            return 'Full Refund Initiated by User';
        case BillingStatus.REFUND_BY_USER_COMPLETE:
            return 'Full Refund Complete by User';

        // Partial refund (generic)
        case BillingStatus.REFUND_PARTIAL_INITIATED:
            return 'Partial Refund Initiated';
        case BillingStatus.REFUND_PARTIAL_COMPLETE:
            return 'Partial Refund Complete';

        // Partial refund (by host/user)
        case BillingStatus.REFUND_PARTIAL_BY_HOST_INITIATED:
            return 'Partial Refund Initiated by Host';
        case BillingStatus.REFUND_PARTIAL_BY_HOST_COMPLETE:
            return 'Partial Refund Complete by Host';
        case BillingStatus.REFUND_PARTIAL_BY_USER_INITIATED:
            return 'Partial Refund Initiated by User';
        case BillingStatus.REFUND_PARTIAL_BY_USER_COMPLETE:
            return 'Partial Refund Complete by User';

        case BillingStatus.EXPIRED:
            return 'Payment Expired';

        default:
            return 'Unknown Status';
    }
};
const DateTimeService = require("../services/date-time/date-time.service");
const {
  EMAIL_TEMPLATE,
} = require("../utilities/constants/email-template.constant");

class EmailTemplate {

  async createTemplate(type, options) {
    const dateTimeService = new DateTimeService();
    let html = ``;
    switch (type) {
      case EMAIL_TEMPLATE.OTP_SEND:
        html = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>OTP Verification</h2>
            <p>We’ve sent this to <strong>${options.email}</strong></p>
            <p>Your One-Time Password (OTP) is:</p>
            <h1 style="color: #2c3e50;">${options.otp}</h1>
            <p>This OTP will expire in <b>10</b> minutes.</p>
            <p style="color: gray;">If you didn’t request this, you can ignore this email.</p>
          </div>`;
        break;

      case EMAIL_TEMPLATE.ROOM_CONFIRMED: {

        const order = options.order;
        const tenant = order.tenant[0];

        const host = order.host[0];
        const room = order.room[0];

        const details = order.bookingDetails;
        const totalGuests = 1 + details.extraAdultCount;

        const checkin = await dateTimeService.getFormmatedTime(details.checkin);
        const checkout = await dateTimeService.getFormmatedTime(details.checkout);

        html =
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background-color: #d9534f; color: #fff; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">Booking Confirmed!</h2>
            </div>

            <!-- Body -->
            <div style="padding: 20px;"> 
              <p>Hello <strong>${tenant.firstName} ${tenant.lastName}</strong>,</p>
              <p>Your booking for the room <strong>"${room.title}"</strong> has been successfully confirmed.</p>

              <h3 style="color: #d9534f; border-bottom: 2px solid #d9534f; display: inline-block; padding-bottom: 5px; margin-top: 20px;">Booking Summary</h3>

              <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Order ID</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.receipt}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Host</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${host.firstName} ${host.lastName} (${host.email})</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Location</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${room.location?.city || ''}, ${room.location?.pincode || ''}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Check-in</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${checkin}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Check-out</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${checkout}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Nights</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${details.nights}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Guests</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${totalGuests}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Base Price</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${details.basePrice}</td>
                </tr>
                ${details.extraAdultCount > 0 ? `<tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Extra Adults (${details.extraAdultCount} × ₹${details.extraAdultRate})</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${details.extraAdultCharge}</td>
                </tr>` : ''}
                ${details.childCount > 0 ? `<tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Children (${details.childCount} × ₹${details.childRate})</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${details.childCharge}</td>
                </tr>` : ''}
                ${details.petCount > 0 ? `<tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Pets (${details.petCount} × ₹${details.petRate})</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${details.petCharge}</td>
                </tr>` : ''}
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Cleaning Fee</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${details.cleaningFee}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Service Charge</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${details.serviceCharge}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">GST (${details.gstRate * 100}%)</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${details.gst}</td>
                </tr>
                <tr style="background-color: #d9534f; color: #fff; font-weight:bold;">
                  <th style="text-align:left; padding: 10px;">Total</th>
                  <td style="padding: 10px;">₹${details.total}</td>
                </tr>
              </table>

              <p style="margin-top: 20px; text-align: center;">Thank you for booking with <strong>Roomly</strong>!</p>
            </div>
          </div>`
        break;
      }
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_HOST: {

        const order = options.order;
        const tenant = order.tenant[0];

        const host = order.host[0];
        const room = order.room[0];

        const details = order.bookingDetails;
        const totalGuests = 1 + details.extraAdultCount;

        const checkin = await dateTimeService.getFormmatedTime(details.checkin);
        const checkout = await dateTimeService.getFormmatedTime(details.checkout);

        html =
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background-color: #d9534f; color: #fff; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">Booking Cancelled</h2>
            </div>

            <!-- Body -->
            <div style="padding: 20px;">
              <p>Hello <strong>${tenant.firstName} ${tenant.lastName}</strong>,</p>
              <p>We regret to inform you that your booking for the room <strong>"${room.title}"</strong> has been cancelled by the host.</p>
              
              <p>Your payment refund has been initiated. Please note that the refund will reflect in your account within <strong>5-7 business days</strong>.</p>

              <h3 style="color: #d9534f; border-bottom: 2px solid #d9534f; display: inline-block; padding-bottom: 5px; margin-top: 20px;">Booking Details</h3>

              <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Order ID</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.receipt}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Host</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${host.firstName} ${host.lastName} (${host.email})</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Location</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${room.location?.city || ''}, ${room.location?.pincode || ''}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Check-in</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${checkin}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Check-out</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${checkout}</td>
                </tr>
                <tr>
                  <th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Guests</th>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${totalGuests}</td>
                </tr>
                <tr style="background-color: #d9534f; color: #fff; font-weight:bold;">
                  <th style="text-align:left; padding: 10px;">Refund Status</th>
                  <td style="padding: 10px;">Initiated (5-7 business days)</td>
                </tr>
              </table>

              <p style="margin-top: 20px; text-align: center;">We apologize for the inconvenience. Thank you for choosing <strong>Roomly</strong>.</p>
            </div>
          </div>`;
      }
        break;


      /**
       * USER CANCELLED — FULL REFUND (Tenant)
       */
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_FULL: {
        const order = options.order;
        const tenant = order.tenant[0];
        const host = order.host[0];
        const room = order.room[0];
        const d = order.bookingDetails;

        const totalGuests = 1 + (d.extraAdultCount || 0);
        const checkin = await dateTimeService.getFormmatedTime(d.checkin);
        const checkout = await dateTimeService.getFormmatedTime(d.checkout);

        html = `
          <div style="font-family: Arial, sans-serif; max-width: 720px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
            <div style="background:#28a745; color:#fff; padding:20px; text-align:center;">
              <h2 style="margin:0;">Booking Cancelled – Full Refund</h2>
            </div>

            <div style="padding:20px;">
              <p>Hello <strong>${tenant.firstName} ${tenant.lastName}</strong>,</p>
              <p>You cancelled your booking for <strong>${room.title}</strong>. A <strong>full refund</strong> of <strong>₹${d.total.toFixed(2)}</strong> has been initiated.</p>
              <p>Refunds typically reflect in your account within <strong>5–7 business days</strong>.</p>

              <h3 style="margin:20px 0 8px; color:#333;">What you paid</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Base rate (₹${d.basePrice} × ${d.nights} nights)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${(d.baseCharge || 0).toFixed(2)}</td></tr>
                  ${d.extraAdultCount > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Extra adults (${d.extraAdultCount} × ₹${d.extraAdultRate} × ${d.nights} nights)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${(d.extraAdultCharge || 0).toFixed(2)}</td></tr>` : ``}
                  ${d.childCount > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Children (${d.childCount} × ₹${d.childRate} × ${d.nights} nights)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${(d.childCharge || 0).toFixed(2)}</td></tr>` : ``}
                  ${d.petCount > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Pets (${d.petCount} × ₹${d.petRate} × ${d.nights} nights)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${(d.petCharge || 0).toFixed(2)}</td></tr>` : ``}
                  ${d.cleaningFee > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Cleaning fee</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${(d.cleaningFee || 0).toFixed(2)}</td></tr>` : ``}
                  ${d.serviceCharge > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Service fee (${(d.serviceRate * 100).toFixed(0)}%)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${(d.serviceCharge || 0).toFixed(2)}</td></tr>` : ``}
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">GST (${(d.gstRate * 100).toFixed(0)}%)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${(d.gst || 0).toFixed(2)}</td></tr>
                  <tr style="font-weight:bold;"><td style="padding:8px;">Total Paid</td><td style="padding:8px; text-align:right;">₹${d.total.toFixed(2)}</td></tr>
                </tbody>
              </table>

              <h3 style="margin:20px 0 8px; color:#28a745;">Refund</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr style="background:#eaf7ee; font-weight:bold;"><td style="padding:8px;">Refunded to you</td><td style="padding:8px; text-align:right;">₹${d.total.toFixed(2)}</td></tr>
                  <tr><td style="padding:8px; color:#666;">Status</td><td style="padding:8px; text-align:right; color:#28a745;">Initiated (5–7 business days)</td></tr>
                </tbody>
              </table>

              <h3 style="margin:20px 0 8px; color:#333;">Booking Details</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Order ID</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${order.receipt}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-in</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkin}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-out</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkout}</td></tr>
                  <tr><td style="padding:8px;">Guests</td><td style="padding:8px; text-align:right;">${totalGuests}</td></tr>
                </tbody>
              </table>
            </div>
          </div>`;
        break;
      }

      /**
       * USER CANCELLED — PARTIAL REFUND (Tenant)
       * Option A: Deduct only 1st night (base + guest). Refund cleaning, service, GST & remaining nights.
       */
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_PARTIAL: {
        const order = options.order;
        const tenant = order.tenant[0];
        const host = order.host[0];
        const room = order.room[0];
        const d = order.bookingDetails;

        const totalGuests = 1 + (d.extraAdultCount || 0);
        const checkin = await dateTimeService.getFormmatedTime(d.checkin);
        const checkout = await dateTimeService.getFormmatedTime(d.checkout);

        // 1st-night components
        const firstNightBase = d.basePrice || 0;
        const firstNightExtraAdults = (d.extraAdultRate || 0) * (d.extraAdultCount || 0);
        const firstNightChildren = (d.childRate || 0) * (d.childCount || 0);
        const firstNightPets = (d.petRate || 0) * (d.petCount || 0);
        const firstNightCharge = firstNightBase + firstNightExtraAdults + firstNightChildren + firstNightPets;

        // Remaining nights (refunded)
        const remainingBase = Math.max((d.baseCharge || 0) - firstNightBase, 0);
        const remainingExtraAdults = Math.max((d.extraAdultCharge || 0) - firstNightExtraAdults, 0);
        const remainingChildren = Math.max((d.childCharge || 0) - firstNightChildren, 0);
        const remainingPets = Math.max((d.petCharge || 0) - firstNightPets, 0);

        const refundedCleaning = d.cleaningFee || 0;
        const refundedService = d.serviceCharge || 0;
        const refundedGST = d.gst || 0;

        const refundAmount = remainingBase + remainingExtraAdults + remainingChildren + remainingPets + refundedCleaning + refundedService + refundedGST;

        html = `
          <div style="font-family: Arial, sans-serif; max-width: 720px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
            <div style="background:#ffc107; color:#000; padding:20px; text-align:center;">
              <h2 style="margin:0;">Booking Cancelled – Partial Refund</h2>
            </div>

            <div style="padding:20px;">
              <p>Hello <strong>${tenant.firstName} ${tenant.lastName}</strong>,</p>
              <p>You cancelled your booking for <strong>${room.title}</strong>.</p>

              <h3 style="margin:16px 0 8px;">What we deducted (1st night)</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Base rate (1 night)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${firstNightBase.toFixed(2)}</td></tr>
                  ${d.extraAdultCount > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Extra adults (${d.extraAdultCount} × ₹${d.extraAdultRate})</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${firstNightExtraAdults.toFixed(2)}</td></tr>` : ``}
                  ${d.childCount > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Children (${d.childCount} × ₹${d.childRate})</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${firstNightChildren.toFixed(2)}</td></tr>` : ``}
                  ${d.petCount > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Pets (${d.petCount} × ₹${d.petRate})</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${firstNightPets.toFixed(2)}</td></tr>` : ``}
                  <tr style="font-weight:bold;"><td style="padding:8px;">Total deduction (kept)</td><td style="padding:8px; text-align:right;">₹${firstNightCharge.toFixed(2)}</td></tr>
                </tbody>
              </table>

              <h3 style="margin:16px 0 8px;">What we refunded</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  ${remainingBase > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Remaining nights – base</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${remainingBase.toFixed(2)}</td></tr>` : ``}
                  ${remainingExtraAdults > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Remaining nights – extra adults</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${remainingExtraAdults.toFixed(2)}</td></tr>` : ``}
                  ${remainingChildren > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Remaining nights – children</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${remainingChildren.toFixed(2)}</td></tr>` : ``}
                  ${remainingPets > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Remaining nights – pets</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${remainingPets.toFixed(2)}</td></tr>` : ``}
                  ${refundedCleaning > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Cleaning fee</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${refundedCleaning.toFixed(2)}</td></tr>` : ``}
                  ${refundedService > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">Service fee (${(d.serviceRate * 100).toFixed(0)}%)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${refundedService.toFixed(2)}</td></tr>` : ``}
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">GST (${(d.gstRate * 100).toFixed(0)}%)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${refundedGST.toFixed(2)}</td></tr>
                  <tr style="background:#fff7e0; font-weight:bold;"><td style="padding:8px;">Total refunded to you</td><td style="padding:8px; text-align:right;">₹${refundAmount.toFixed(2)}</td></tr>
                  <tr><td style="padding:8px; color:#666;">Status</td><td style="padding:8px; text-align:right; color:#d58512;">Initiated (5–7 business days)</td></tr>
                </tbody>
              </table>

              <h3 style="margin:20px 0 8px; color:#333;">Booking Details</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Order ID</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${order.receipt}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-in</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkin}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-out</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkout}</td></tr>
                  <tr><td style="padding:8px;">Guests</td><td style="padding:8px; text-align:right;">${totalGuests}</td></tr>
                </tbody>
              </table>
            </div>
          </div>`;
        break;
      }

      /**
       * USER CANCELLED — NO REFUND (Tenant)
       */
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_NO: {
        const order = options.order;
        const tenant = order.tenant[0];
        const host = order.host[0];
        const room = order.room[0];
        const d = order.bookingDetails;

        const totalGuests = 1 + (d.extraAdultCount || 0);
        const checkin = await dateTimeService.getFormmatedTime(d.checkin);
        const checkout = await dateTimeService.getFormmatedTime(d.checkout);

        html = `
          <div style="font-family: Arial, sans-serif; max-width: 720px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
            <div style="background:#dc3545; color:#fff; padding:20px; text-align:center;">
              <h2 style="margin:0;">Booking Cancelled – No Refund</h2>
            </div>

            <div style="padding:20px;">
              <p>Hello <strong>${tenant.firstName} ${tenant.lastName}</strong>,</p>
              <p>You cancelled your booking for <strong>${room.title}</strong> after the refund window. As per policy, <strong>no refund</strong> applies.</p>

              <h3 style="margin:16px 0 8px;">Charge Summary</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Total charged</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${d.total.toFixed(2)}</td></tr>
                  <tr style="background:#fbe9eb; font-weight:bold;"><td style="padding:8px;">Refunded</td><td style="padding:8px; text-align:right;">₹0.00</td></tr>
                </tbody>
              </table>

              <h3 style="margin:20px 0 8px; color:#333;">Booking Details</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Order ID</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${order.receipt}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-in</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkin}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-out</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkout}</td></tr>
                  <tr><td style="padding:8px;">Guests</td><td style="padding:8px; text-align:right;">${totalGuests}</td></tr>
                </tbody>
              </table>
            </div>
          </div>`;
        break;
      }

      /**
       * USER CANCELLED — FULL REFUND (Host notification)
       */
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_FULL_HOST: {
        const order = options.order;
        const tenant = order.tenant[0];
        const host = order.host[0];
        const room = order.room[0];
        const d = order.bookingDetails;

        const checkin = await dateTimeService.getFormmatedTime(d.checkin);
        const checkout = await dateTimeService.getFormmatedTime(d.checkout);

        // Expected host payout (pre-platform deductions) in full-refund case is 0.
        const expectedHostPayoutPreFees = 0;

        html = `
          <div style="font-family: Arial, sans-serif; max-width:720px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
            <div style="background:#28a745; color:#fff; padding:20px; text-align:center;">
              <h2 style="margin:0;">Guest Cancelled – Full Refund to Guest</h2>
            </div>

            <div style="padding:20px;">
              <p>Hello <strong>${host.firstName} ${host.lastName}</strong>,</p>
              <p>Your guest <strong>${tenant.firstName} ${tenant.lastName}</strong> cancelled their booking for <strong>${room.title}</strong> within the free-cancellation window. The guest has been refunded in full.</p>

              <h3 style="margin:16px 0 8px;">Financial Summary</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Guest charged (original)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${d.total.toFixed(2)}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Refund to guest</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${d.total.toFixed(2)}</td></tr>
                  <tr style="background:#eaf7ee; font-weight:bold;"><td style="padding:8px;">Expected host payout (pre-fees)</td><td style="padding:8px; text-align:right;">₹${expectedHostPayoutPreFees.toFixed(2)}</td></tr>
                </tbody>
              </table>

              <h3 style="margin:20px 0 8px; color:#333;">Booking Details</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Order ID</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${order.receipt}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-in</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkin}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-out</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkout}</td></tr>
                </tbody>
              </table>

              <p style="margin-top:12px; color:#666; font-size:13px;">Note: Host payouts may be subject to platform/processing fees per your payout schedule.</p>
            </div>
          </div>`;
        break;
      }

      /**
       * USER CANCELLED — PARTIAL REFUND (Host notification)
       */
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_PARTIAL_HOST: {
        const order = options.order;
        const tenant = order.tenant[0];
        const host = order.host[0];
        const room = order.room[0];
        const d = order.bookingDetails;

        const checkin = await dateTimeService.getFormmatedTime(d.checkin);
        const checkout = await dateTimeService.getFormmatedTime(d.checkout);

        // 1st-night components (kept by host per policy)
        const firstNightBase = d.basePrice || 0;
        const firstNightExtraAdults = (d.extraAdultRate || 0) * (d.extraAdultCount || 0);
        const firstNightChildren = (d.childRate || 0) * (d.childCount || 0);
        const firstNightPets = (d.petRate || 0) * (d.petCount || 0);
        const firstNightCharge = firstNightBase + firstNightExtraAdults + firstNightChildren + firstNightPets;

        // Remaining nights + fees refunded to guest
        const remainingBase = Math.max((d.baseCharge || 0) - firstNightBase, 0);
        const remainingExtraAdults = Math.max((d.extraAdultCharge || 0) - firstNightExtraAdults, 0);
        const remainingChildren = Math.max((d.childCharge || 0) - firstNightChildren, 0);
        const remainingPets = Math.max((d.petCharge || 0) - firstNightPets, 0);

        const refundedCleaning = d.cleaningFee || 0;
        const refundedService = d.serviceCharge || 0;
        const refundedGST = d.gst || 0;
        const refundAmount = remainingBase + remainingExtraAdults + remainingChildren + remainingPets + refundedCleaning + refundedService + refundedGST;

        // Host payout (pre-fees) = first night kept; platform fees/taxes handled separately by payout system
        const expectedHostPayoutPreFees = firstNightCharge;

        html = `
          <div style="font-family: Arial, sans-serif; max-width:720px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
            <div style="background:#ffc107; color:#000; padding:20px; text-align:center;">
              <h2 style="margin:0;">Guest Cancelled – Partial Refund</h2>
            </div>

            <div style="padding:20px;">
              <p>Hello <strong>${host.firstName} ${host.lastName}</strong>,</p>
              <p>Your guest <strong>${tenant.firstName} ${tenant.lastName}</strong> cancelled their booking for <strong>${room.title}</strong>.</p>

              <h3 style="margin:16px 0 8px;">Financial Summary</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Guest charged (original)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${d.total.toFixed(2)}</td></tr>

                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Refund to guest</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${refundAmount.toFixed(2)}</td></tr>

                  <tr style="background:#fff7e0;"><td style="padding:8px;">Refund breakdown</td><td style="padding:8px; text-align:right;"></td></tr>
                  ${remainingBase > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">• Remaining nights – base</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${remainingBase.toFixed(2)}</td></tr>` : ``}
                  ${remainingExtraAdults > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">• Remaining nights – extra adults</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${remainingExtraAdults.toFixed(2)}</td></tr>` : ``}
                  ${remainingChildren > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">• Remaining nights – children</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${remainingChildren.toFixed(2)}</td></tr>` : ``}
                  ${remainingPets > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">• Remaining nights – pets</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${remainingPets.toFixed(2)}</td></tr>` : ``}
                  ${refundedCleaning > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">• Cleaning fee</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${refundedCleaning.toFixed(2)}</td></tr>` : ``}
                  ${refundedService > 0 ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;">• Service fee (${(d.serviceRate * 100).toFixed(0)}%)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${refundedService.toFixed(2)}</td></tr>` : ``}
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">• GST (${(d.gstRate * 100).toFixed(0)}%)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${refundedGST.toFixed(2)}</td></tr>

                  <tr style="background:#eaf7ee; font-weight:bold;"><td style="padding:8px;">Expected host payout (pre-fees)</td><td style="padding:8px; text-align:right;">₹${expectedHostPayoutPreFees.toFixed(2)}</td></tr>
                </tbody>
              </table>

              <h3 style="margin:20px 0 8px; color:#333;">Booking Details</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Order ID</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${order.receipt}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-in</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkin}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-out</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkout}</td></tr>
                </tbody>
              </table>

              <p style="margin-top:12px; color:#666; font-size:13px;">Note: Host payouts may exclude platform/service fees & taxes; check your payout dashboard for final amounts.</p>
            </div>
          </div>`;
        break;
      }

      /**
       * USER CANCELLED — NO REFUND (Host notification)
       */
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_NO_HOST: {
        const order = options.order;
        const tenant = order.tenant[0];
        const host = order.host[0];
        const room = order.room[0];
        const d = order.bookingDetails;

        const checkin = await dateTimeService.getFormmatedTime(d.checkin);
        const checkout = await dateTimeService.getFormmatedTime(d.checkout);

        // Expected host payout (pre-fees) excludes service fee and GST
        const expectedHostPayoutPreFees =
          (d.baseCharge || 0) + (d.extraAdultCharge || 0) + (d.childCharge || 0) + (d.petCharge || 0) + (d.cleaningFee || 0);

        html = `
<div style="font-family: Arial, sans-serif; max-width:720px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
  <div style="background:#dc3545; color:#fff; padding:20px; text-align:center;">
    <h2 style="margin:0;">Guest Cancelled – No Refund</h2>
  </div>

  <div style="padding:20px;">
    <p>Hello <strong>${host.firstName} ${host.lastName}</strong>,</p>
    <p>Your guest <strong>${tenant.firstName} ${tenant.lastName}</strong> cancelled their booking for <strong>${room.title}</strong> after the refund window. No refund has been issued to the guest.</p>

    <h3 style="margin:16px 0 8px;">Financial Summary</h3>
    <table style="width:100%; border-collapse:collapse;">
      <tbody>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;">Guest charged (total)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${d.total.toFixed(2)}</td></tr>
        <tr style="background:#fbe9eb; font-weight:bold;"><td style="padding:8px;">Refund to guest</td><td style="padding:8px; text-align:right;">₹0.00</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;">Expected host payout (pre-fees)</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${expectedHostPayoutPreFees.toFixed(2)}</td></tr>
      </tbody>
    </table>

    <p style="margin-top:10px; color:#666; font-size:13px;">
      Note: Service fee (₹${(d.serviceCharge || 0).toFixed(2)}) and GST (₹${(d.gst || 0).toFixed(2)}) are not part of host payout.
      Final payout may include additional platform/processing deductions per your payout schedule.
    </p>

    <h3 style="margin:20px 0 8px; color:#333;">Booking Details</h3>
    <table style="width:100%; border-collapse:collapse;">
      <tbody>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;">Order ID</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${order.receipt}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-in</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkin}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-out</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkout}</td></tr>
      </tbody>
    </table>
  </div>
</div>`;
        break;
      }

      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_HOST_FULL_REFUND: {
        const order = options.order;
        const tenant = order.tenant[0];
        const host = order.host[0];
        const room = order.room[0];
        const d = order.bookingDetails;
        const refund = order.bookingDetails.total;

        const checkin = await dateTimeService.getFormmatedTime(d.checkin);
        const checkout = await dateTimeService.getFormmatedTime(d.checkout);

        html = `
          <div style="font-family: Arial, sans-serif; max-width:720px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
            <div style="background:#dc3545; color:#fff; padding:20px; text-align:center;">
              <h2 style="margin:0;">Booking Cancelled – Full Refund Issued</h2>
            </div>

            <div style="padding:20px;">
              <p>Hello <strong>${host.firstName} ${host.lastName}</strong>,</p>
              <p>You cancelled the booking for <strong>${room.title}</strong> made by guest <strong>${tenant.firstName} ${tenant.lastName}</strong>. A full refund has been successfully issued to the guest’s original payment method.</p>

              <h3 style="margin:16px 0 8px;">Financial Summary</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr>
                    <td style="padding:8px; border-bottom:1px solid #eee;">Guest charged (total)</td>
                    <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${d.total.toFixed(2)}</td>
                  </tr>
                  <tr style="background:#fbe9eb; font-weight:bold;">
                    <td style="padding:8px;">Refund to guest</td>
                    <td style="padding:8px; text-align:right;">₹${refund.amount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px; border-bottom:1px solid #eee;">Expected host payout</td>
                    <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹0.00</td>
                  </tr>
                </tbody>
              </table>

              <p style="margin-top:10px; color:#666; font-size:13px;">
                Note: Since the booking was cancelled by you, no payout will be made for this reservation.
              </p>

              <h3 style="margin:20px 0 8px; color:#333;">Booking Details</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr>
                    <td style="padding:8px; border-bottom:1px solid #eee;">Order ID</td>
                    <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${order.receipt}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px; border-bottom:1px solid #eee;">Check-in</td>
                    <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkin}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px; border-bottom:1px solid #eee;">Check-out</td>
                    <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkout}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>`;
        break;
      }

      // ======================
      // TENANT EMAIL TEMPLATE
      // ======================

      case EMAIL_TEMPLATE.BOOKING_PAYMENT_RECEIVED_TENANT: {
        const order = options.order;
        const tenant = order.tenant[0];
        const host = order.host[0];
        const room = order.room[0];
        const d = order.bookingDetails;

        const checkin = await dateTimeService.getFormmatedTime(d.checkin);
        const checkout = await dateTimeService.getFormmatedTime(d.checkout);

        html = `
            <div style="font-family: Arial, sans-serif; max-width:720px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
              <div style="background:#007bff; color:#fff; padding:20px; text-align:center;">
                <h2 style="margin:0;">Payment Received Successfully</h2>
              </div>

              <div style="padding:20px;">
                <p>Hello <strong>${tenant.firstName} ${tenant.lastName}</strong>,</p>
                <p>We’ve received your payment of <strong>₹${d.total.toFixed(2)}</strong> for your booking at <strong>${room.title}</strong>.</p>
                <p>Your booking confirmation will be processed shortly by the host <strong>${host.firstName} ${host.lastName}</strong>. We’ll inform you once it’s confirmed.</p>

                <h3 style="margin:20px 0 8px; color:#333;">Booking Details</h3>
                <table style="width:100%; border-collapse:collapse;">
                  <tbody>
                    <tr><td style="padding:8px; border-bottom:1px solid #eee;">Order ID</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${order.receipt}</td></tr>
                    <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-in</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkin}</td></tr>
                    <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-out</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkout}</td></tr>
                  </tbody>
                </table>

                <p style="margin-top:12px; color:#666; font-size:13px;">We’ll notify you once the host confirms your booking. Thank you for choosing our platform!</p>
              </div>
            </div>`;
        break;
      }


      // ======================
      // HOST EMAIL TEMPLATE
      // ======================
      case EMAIL_TEMPLATE.NEW_BOOKING_HOST: {
        const order = options.order;
        const tenant = order.tenant[0];
        const host = order.host[0];
        const room = order.room[0];
        const d = order.bookingDetails;

        const checkin = await dateTimeService.getFormmatedTime(d.checkin);
        const checkout = await dateTimeService.getFormmatedTime(d.checkout);

        html = `
          <div style="font-family: Arial, sans-serif; max-width:720px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
            <div style="background:#28a745; color:#fff; padding:20px; text-align:center;">
              <h2 style="margin:0;">New Booking Received</h2>
            </div>

            <div style="padding:20px;">
              <p>Hello <strong>${host.firstName} ${host.lastName}</strong>,</p>
              <p>You’ve received a new booking request from <strong>${tenant.firstName} ${tenant.lastName}</strong> for your property <strong>${room.title}</strong>.</p>

              <h3 style="margin:20px 0 8px; color:#333;">Booking Details</h3>
              <table style="width:100%; border-collapse:collapse;">
                <tbody>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Order ID</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${order.receipt}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Guest</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${tenant.firstName} ${tenant.lastName}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-in</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkin}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Check-out</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${checkout}</td></tr>
                  <tr><td style="padding:8px; border-bottom:1px solid #eee;">Amount Paid</td><td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${d.total.toFixed(2)}</td></tr>
                </tbody>
              </table>

              <p style="margin-top:12px; color:#666; font-size:13px;">Please review and confirm the booking at your earliest convenience. The guest will be notified once you confirm.</p>
            </div>
          </div>`;
        break;
      }



      default:
        throw new Error("Please Select a valid type")
    }
    return `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <title>Your OTP Code</title>
                    <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .container { max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        ${html}
                    </div>
                </body>
            </html>`;
  }

  createSubject(type, param = {}) {
    switch (type) {
      case EMAIL_TEMPLATE.OTP_SEND:
        return `Roomly Otp Verification`;
      case EMAIL_TEMPLATE.ROOM_CONFIRMED:
        return `Booking Confirmed: ${param.title} – See Your Details | Roomly`;
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_HOST:
        return `Booking Cancelled: ${param.title} – Refund Initiated | Roomly`;
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_FULL:
        return `Booking Cancelled by You: ${param.title} – Full Refund Initiated | Roomly`;
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_PARTIAL:
        return `Booking Cancelled by You: ${param.title} – Partial Refund Initiated | Roomly`;
      case EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_NO:
        return `Booking Cancelled by You: ${param.title} – No Refund Applicable | Roomly`;
      case EMAIL_TEMPLATE.BOOKING_PAYMENT_RECEIVED_TENANT:
        return `Payment Successful: ${param.title} – Awaiting Host Confirmation | Roomly`;
      case EMAIL_TEMPLATE.NEW_BOOKING_HOST:
        return `New Booking Received: ${param.title} – Action Required | Roomly`;
      default:
        break;
    }
  }

}

module.exports = EmailTemplate;
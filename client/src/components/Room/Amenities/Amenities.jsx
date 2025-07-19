import React from "react";

const amenities = [
  {
    iconClass: "bi bi-snow",
    title: "Designed for staying cool",
    description: "Beat the heat with A/C and ceiling fan.",
  },
  {
    iconClass: "bi bi-water",
    title: "Private pool",
    description: "Dive right in — your own pool is waiting.",
  },
  {
    iconClass: "bi bi-calendar-event",
    title: "Flexible cancellation",
    description: "Cancel before 7 Aug for a full refund.",
  },
  {
    iconClass: "bi bi-wifi",
    title: "Free Wi-Fi",
    description: "Stay connected with high-speed internet.",
  },
  {
    iconClass: "bi bi-car-front",
    title: "Free parking",
    description: "Dedicated on-site parking for your vehicle.",
  },
  {
    iconClass: "bi bi-cup-hot",
    title: "Breakfast included",
    description: "Start your day with a complimentary breakfast.",
  },
];

const Amenities = () => {
  return (
    <div className="container py-5">
      <h3 className="mb-4">What this place offers</h3>
      <div className="row">
        {amenities.map((item, index) => (
          <div className="col-md-6 mb-4 d-flex" key={index}>
            <div className="me-3">
              <i className={`${item.iconClass} fs-3 text-primary`}></i>
            </div>
            <div>
              <h5 className="mb-1">{item.title}</h5>
              <p className="text-muted mb-0">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Amenities;

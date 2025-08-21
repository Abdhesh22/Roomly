import { useState } from "react";
import CustomConfirmationModal from "../../CustomComponent/CustomModal/ConfirmationModal";

const List = ({ list, count }) => {
  return (
    <div className="container py-3">
      <div className="row">
        {list.slice(0, count).map((item, index) => (
          <div
            className="col-md-6 mb-4 d-flex align-items-start"
            key={index}
          >
            <div className="me-3 d-flex justify-content-center align-items-center bg-light rounded-circle shadow-sm"
              style={{ width: "48px", height: "48px" }}>
              <i className={`${item.icon} fs-5 text-primary`}></i>
            </div>
            <div>
              <h6 className="mb-1 fw-semibold">{item.label}</h6>
              <p className="text-muted small mb-0">{item.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Amenities = ({ list }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="py-5">
      <div className="container">
        {/* Header */}
        <h3 className="mb-4 fw-bold border-bottom pb-2">
          What this place offers
        </h3>

        {/* Limited list */}
        <List list={list} count={10} />

        {/* View More */}
        {list?.length > 10 && (
          <div className="text-center mt-4">
            <button
              className="btn btn-gradient"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-grid-fill me-2"></i> {/* Bootstrap icon */}
              View all {list.length} amenities
            </button>
          </div>
        )}


        {/* Modal */}
        <CustomConfirmationModal
          show={showModal}
          title={`All ${list.length} Amenities`}
          message={<List list={list} count={list.length} />}
          onConfirm={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          confirmText={false}
          cancelText="Close"
          size="lg"
          isHtml={false}
        />
      </div>
    </section >
  );
};

export default Amenities;
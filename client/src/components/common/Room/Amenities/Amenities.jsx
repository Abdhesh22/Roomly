const Amenities = ({ list }) => {
  return (
    <div className="container py-5">
      <h3 className="mb-4">What this place offers</h3>
      <div className="row">
        {list.map((item, index) => (
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

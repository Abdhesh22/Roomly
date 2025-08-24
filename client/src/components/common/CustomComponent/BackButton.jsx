import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-3 shadow-sm"
        >
            <i className="bi bi-box-arrow-in-left"></i>
            Back
        </button>
    );
};

export default BackButton;

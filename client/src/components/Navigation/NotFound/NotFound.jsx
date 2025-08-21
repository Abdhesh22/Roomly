// NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="container d-flex flex-column justify-content-center align-items-center text-center h-78vh">
            {/* Illustration Icon */}
            <div className="mb-4">
                <i className="bi bi-emoji-dizzy text-danger display-1"></i>
            </div>

            {/* Headline */}
            <h1 className="display-4 fw-bold text-danger mb-2">404 - Page Not Found</h1>

            {/* Subtext */}
            <p className="lead text-muted mb-4">
                Looks like the page you’re looking for doesn’t exist.<br />
                It may have been moved, deleted, or never existed.
            </p>

            {/* CTA Button */}
            <Link
                to="/"
                className="btn btn-primary btn-lg rounded-pill px-5 d-inline-flex align-items-center gap-2 shadow"
            >
                <i className="bi bi-house-door-fill"></i>
                Back to Home
            </Link>

            {/* Footer Small Note */}
            <p className="text-muted mt-4 small">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Don’t worry, you can always find your perfect stay from the homepage.
            </p>
        </div>
    );
};

export default NotFound;

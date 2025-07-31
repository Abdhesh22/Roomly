import Select from "react-select";

const MultiSelectDropdown = ({
    label,
    options,
    value,
    onChange,
    error,
    isMulti = true,
    placeholder = "Select options...",
}) => {
    return (
        <div className="mb-3">
            {label && <label className="form-label">{label}</label>}
            <Select
                isMulti={isMulti}
                options={options}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                classNamePrefix="react-select"
                className={error ? "is-invalid" : ""}
            />
            {error && <div className="text-danger mt-1">{error.message}</div>}
        </div>
    );
};

export default MultiSelectDropdown;
import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({
    selectedDate,
    onChange,
    minDate,
    maxDate,
    placeholder = "Select date",
    dateFormat = "dd/MM/yyyy",
    className = "",
}) => {

    return (
        <DatePicker
            selected={selectedDate}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText={placeholder}
            dateFormat={dateFormat}
            className={className}
        />
    );
};

export default CustomDatePicker;
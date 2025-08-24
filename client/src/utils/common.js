import { toast } from "react-toastify";
import api from "./request/api.util";
import { addMonths, parseISO, format } from "date-fns";


export function handleCatch(error) {
    if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
    } else {
        console.log(error);
    }
}

export function debounce(fn, delay = 300) {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

export const urlToFile = async (url, filename = "image.jpg", mimeType = "image/jpeg") => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
};

export const fetchStates = async () => {
    try {
        const { data } = await api.get("/api/common/states");
        return data.list;
    } catch (error) {
        handleCatch(error);
    }
}

export const fetchCities = async (stateCode) => {
    try {
        const { data } = await api.get(`/api/common/cities/${stateCode}`);
        return data.list;
    } catch (error) {
        handleCatch(error);
    }
}

export const fetchAmenities = async () => {
    try {
        const { data } = await api.get("/api/common/amenities");
        return data.list;
    } catch (error) {
        handleCatch(error);
    }
}

export const addMonthsToNow = async (monthToAdd) => {
    try {
        const now = new Date();
        return await addMonths(now, monthToAdd);
    } catch (error) {
        handleCatch(error);
    }
}

export const convertStringToIsoDate = async (dateString) => {
    return await parseISO(dateString);
}
import { toast } from "react-toastify";

export function handleCatch(error) {
    if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
    } else {
        console.log(error);
    }
}
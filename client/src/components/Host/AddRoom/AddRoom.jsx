import { useForm, Controller } from "react-hook-form";
import MultiSelectDropdown from "../../../utils/multi-select/MultiSelectDropDown";
import FileUploader from "../../../utils/FileUploader/FileUploader";
import apiService from "../../../utils/request/api.util";
import LocationPicker from "../../../utils/LocationPicker/LocationPicker";
import { cities } from "../../../utils/constants/cities.constant";
import { states } from "../../../utils/constants/states.constant";
const amenitiesList = [
    { value: "wifi", label: "Wi-Fi", icon: "bi bi-wifi" },
    { value: "ac", label: "Air Conditioning", icon: "bi bi-wind" },
    { value: "pool", label: "Swimming Pool", icon: "bi bi-water" },
    { value: "kitchen", label: "Kitchen", icon: "bi bi-cup-straw" },
    { value: "tv", label: "TV", icon: "bi bi-tv" },
    { value: "parking", label: "Parking", icon: "bi bi-car-front-fill" },
    { value: "gym", label: "Gym", icon: "bi bi-heart-pulse" },
    { value: "pet", label: "Pet Friendly", icon: "bi bi-bug" },
    { value: "laundry", label: "Laundry Service", icon: "bi bi-basket" },
    { value: "breakfast", label: "Breakfast Included", icon: "bi bi-egg-fried" },
    { value: "smoking", label: "Smoking Allowed", icon: "bi bi-wind" },
    { value: "fireplace", label: "Fireplace", icon: "bi bi-fire" },
    { value: "balcony", label: "Balcony", icon: "bi bi-house-door" },
    { value: "elevator", label: "Elevator", icon: "bi bi-building" },
    { value: "security", label: "24/7 Security", icon: "bi bi-shield-lock" },
    { value: "cctv", label: "CCTV", icon: "bi bi-camera-video" },
    { value: "wheelchair", label: "Wheelchair Accessible", icon: "bi bi-person-wheelchair" },
    { value: "spa", label: "Spa", icon: "bi bi-heart-pulse" },
    { value: "bar", label: "Mini Bar", icon: "bi bi-cup-straw" },
    { value: "heater", label: "Room Heater", icon: "bi bi-thermometer-sun" },

    // More additions
    { value: "beach", label: "Beach Access", icon: "bi bi-sunset" },
    { value: "gaming", label: "Gaming Console", icon: "bi bi-controller" },
    { value: "music", label: "Music System", icon: "bi bi-music-note-beamed" },
    { value: "books", label: "Books & Magazines", icon: "bi bi-book" },
    { value: "bbq", label: "BBQ Area", icon: "bi bi-fire" },
    { value: "desk", label: "Work Desk", icon: "bi bi-laptop" },
    { value: "roomservice", label: "Room Service", icon: "bi bi-bell" },
    { value: "hotwater", label: "Hot Water", icon: "bi bi-droplet" }
];

const AddRoom = () => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("data: ", data);
        const formData = new FormData();
        ["pincode", "about", "maxGuests", "maxAdults", "maxTeens", "basePrice", "pricePerGuest", "pricePerAdult", "pricePerTeen"].forEach(key => {
            formData.append(key, data[key]);
        });

        // Append images (ensure they are File objects)
        data.images.forEach((file, index) => {
            if (file instanceof File) {
                formData.append("images", file); // 'images' as an array
            }
        });

        // Append state and city (stringify objects)
        formData.append("state", JSON.stringify(data.state));
        formData.append("city", JSON.stringify(data.city));

        // Append amenities (stringify array of objects)
        formData.append("amenities", JSON.stringify(data.amenities));

        //google api locations
        formData.append("latitude", data.latitude);
        formData.append("longitude", data.longitude);


    };

    const addressOptions = (address, key) => {
        const value = address?.[key];
        console.log(value);
        if (!value) return null;
        console.log({
            label: value,
            value: value.toLowerCase().replace(/\s+/g, "_"),
        })
        return {
            label: value,
            value: value.toLowerCase().replace(/\s+/g, "_"),
        };
    };


    const handlePlace = (place) => {
        setValue("latitude", place.latitude);
        setValue("longitude", place.longitudes);
        setValue("state", addressOptions(place.address, 'state'));
        setValue("city", addressOptions(place.address, 'city'));
        if (place.address.postcode) {
            setValue("pincode", place.address.postcode)
        }
    }

    return (
        <div className="container mt-4">
            <h2>Add Room</h2>
            <form onSubmit={handleSubmit(onSubmit)}>


                <LocationPicker
                    onChange={(place) => {
                        console.log("on change")
                        handlePlace(place);
                    }}
                />

                {/* Upload Images */}
                <Controller
                    name="images"
                    control={control}
                    rules={{
                        required: "At least one image is required",
                        validate: (files) =>
                            files?.length <= 5 || "You can only upload up to 5 images",
                    }}
                    render={({ field }) => (
                        <FileUploader
                            label="Upload Images (max 5)"
                            accept="image/*"
                            maxFiles={5}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.images}
                        />
                    )}
                />

                <div className="row">

                    {/* State */}
                    <div className="col-md-4">
                        <Controller
                            name="state"
                            control={control}
                            rules={{ required: "Select State" }}
                            render={({ field }) => (
                                <MultiSelectDropdown
                                    label="State"
                                    options={states}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.states}
                                    isMulti={false} // Only one selectable
                                />
                            )}
                        />
                    </div>

                    {/* City */}
                    <div className="col-md-4">
                        <Controller
                            name="city"
                            control={control}
                            rules={{ required: "Select City" }}
                            render={({ field }) => (
                                <MultiSelectDropdown
                                    label="City or Nearby Area"
                                    options={cities}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.cities}
                                    isMulti={false} // Only one selectable
                                />
                            )}
                        />
                    </div>

                    {/* Pincode */}
                    <div className="col-md-4">
                        <div className="mb-3">
                            <label className="form-label">Pincode</label>
                            <input
                                type="text"
                                className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                                {...register("pincode", {
                                    required: "Pincode is required",
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: "Pincode must be 6 digits",
                                    },
                                })}
                            />
                            {errors.pincode && (
                                <div className="invalid-feedback">{errors.pincode.message}</div>
                            )}
                        </div>
                    </div>

                </div>



                <input type="hidden" {...register("latitude", { required: true })} />
                <input type="hidden" {...register("longitude", { required: true })} />


                {/* Amenities */}
                <Controller
                    name="amenities"
                    control={control}
                    rules={{ required: "Select at least one amenity" }}
                    render={({ field }) => (
                        <MultiSelectDropdown
                            label="Amenities"
                            options={amenitiesList}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.amenities}
                        />
                    )}
                />

                {/* About Section */}
                <div className="mb-3">
                    <label className="form-label">About</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        {...register("about", { required: "About section is required" })}
                    ></textarea>
                    {errors.about && (
                        <div className="text-danger">{errors.about.message}</div>
                    )}
                </div>

                {/* Guest Details */}
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Max Guests</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("maxGuests", { required: true, min: 1 })}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Max Adults</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("maxAdults", { required: true, min: 0 })}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Max Teens</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("maxTeens", { required: true, min: 0 })}
                        />
                    </div>
                </div>

                {/* Price Details */}
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Base Price</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("basePrice", { required: true, min: 0 })}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Price per Guest</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("pricePerGuest", { required: true, min: 0 })}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Price per Adult</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("pricePerAdult", { required: true, min: 0 })}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Price per Teen</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("pricePerTeen", { required: true, min: 0 })}
                        />
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-success">
                    Submit Room
                </button>
            </form>
        </div>
    );
};

export default AddRoom;
import React from "react";
import { useForm } from "react-hook-form";

const amenitiesList = [
    "Wi-Fi",
    "Air Conditioning",
    "Swimming Pool",
    "Kitchen",
    "TV",
    "Parking",
    "Gym",
    "Pet Friendly",
];

const AddRoom = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    return (
        <div className="container mt-4">
            <h2>Add New Room</h2>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Upload Images */}
                <div className="mb-3">
                    <label className="form-label">Upload Images (max 5)</label>
                    <input
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        {...register("images", {
                            required: "At least one image is required",
                            validate: (files) =>
                                files.length <= 5 || "You can only upload up to 5 images",
                        })}
                    />
                    {errors.images && (
                        <div className="text-danger">{errors.images.message}</div>
                    )}
                </div>

                {/* Location Name */}
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("location", { required: "Location is required" })}
                    />
                    {errors.location && (
                        <div className="text-danger">{errors.location.message}</div>
                    )}
                </div>

                {/* Amenities */}
                <div className="mb-3">
                    <label className="form-label">Amenities</label>
                    <select
                        multiple
                        className="form-select"
                        {...register("amenities", {
                            required: "Select at least one amenity",
                        })}
                    >
                        {amenitiesList.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    {errors.amenities && (
                        <div className="text-danger">{errors.amenities.message}</div>
                    )}
                </div>

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
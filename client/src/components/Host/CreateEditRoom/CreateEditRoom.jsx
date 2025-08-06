import { useForm, Controller } from "react-hook-form";
import MultiSelectDropdown from "../../../utils/multi-select/MultiSelectDropDown";
import FileUploader from "../../../utils/FileUploader/FileUploader";
import api from "../../../utils/request/api.util";
import LocationPicker from "../../../utils/LocationPicker/LocationPicker";
import { fetchAmenities, fetchCities, fetchStates, handleCatch, urlToFile } from "../../../utils/common";
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CreateEditRoom = () => {
    const { register, handleSubmit, control, setValue, formState: { errors }, getValues } = useForm({
        defaultValues: {
            images: [],
            roomNo: '',
            title: '',
            state: null,
            city: null,
            pincode: "",
            latitude: "",
            longitude: "",
            amenities: [],
            description: "",
            occupancy: {
                guest: "",
                bed: "",
                pet: "",
                bath: "",
                bedRoom: "",
            },
            price: { base: "", guest: "", pet: "" },
        },
    });

    const { roomId } = useParams();
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [files, setFiles] = useState([]);
    const [removeAttachments, setRemoveAttachments] = useState([]);

    const onSubmit = async (payload) => {

        try {
            const formData = new FormData();

            // Flat fields
            formData.append("pincode", payload.pincode);
            formData.append("description", payload.description);
            formData.append("latitude", payload.latitude);
            formData.append("longitude", payload.longitude);
            formData.append("roomNo", payload.roomNo);
            formData.append("title", payload.title);

            // Images
            const images = [];
            files.forEach((file) => {
                if (file instanceof File) {
                    console.log(file);
                    if (file.toUpload) {
                        images.push(file);
                        formData.append("images", file);
                    }
                }
            });

            console.log("removeAttachments.length: ", removeAttachments.length);
            if (removeAttachments.length > 0) {
                const filesToRemove = removeAttachments.map(file => file.remoteId);
                console.log("filestoRemove: ", filesToRemove);
                formData.append("removeAttachments", JSON.stringify(filesToRemove));
            }
            console.log("DS: ", images);


            // Location
            formData.append("state", JSON.stringify(payload.state));
            formData.append("city", JSON.stringify(payload.city));

            // Amenities
            formData.append("amenities", JSON.stringify(payload.amenities));

            // Size & Price
            formData.append("occupancy", JSON.stringify(payload.occupancy));
            formData.append("price", JSON.stringify(payload.price));
            // return;
            let data;
            if (roomId) {
                const res = await api.putMultipart(`/api/rooms/${roomId}`, formData);
                data = res.data;
            } else {
                const res = await api.postMultipart("/api/rooms", formData);
                data = res.data;
            }

            if (data.status) {
                return toast.success(data.message);
            }
        } catch (err) {
            handleCatch(err);
        }
    };

    const addressOptions = (address, key) => {
        const value = address?.[key];
        if (!value) return null;
        return {
            label: value,
            value: value.toLowerCase().replace(/\s+/g, "_"),
        };
    };

    const handlePlace = (place) => {
        setValue("latitude", place.latitude);
        setValue("longitude", place.longitude);
        setValue("state", addressOptions(place.address, "state"));
        setValue("city", addressOptions(place.address, "city"));
        if (place.address.postcode) {
            setValue("pincode", place.address.postcode);
        }
    };

    const fetchRoom = async (amenitiesData) => {
        try {

            const { data } = await api.get(`/api/rooms/${roomId}`);
            if (data.status) {

                const room = data.room;

                setValue("title", room.title);
                setValue("roomNo", room.roomNo);
                setValue("pincode", room.location.pincode || "");
                setValue("latitude", room.location.latitude || "");
                setValue("longitude", room.location.longitude || "");
                setValue("description", room.description || "");

                setValue("state", addressOptions(room.location, "state"));
                setValue("city", addressOptions(room.location, "city"));

                const imageFiles = [];
                for (let i = 0; i < room.attachments.length; i++) {
                    const { remotePath, originalFileName, mimeType } = room.attachments[i];
                    const file = await urlToFile(remotePath, originalFileName, mimeType);
                    file.isAlreadyUploaded = true;
                    file.remoteId = room.attachments[i].remoteId;
                    imageFiles.push(file);
                }

                const selectAmenities = [];
                for (let i = 0; i < room.amenities.length; i++) {
                    const options = amenitiesData.find(item => item.value === room.amenities[i]);
                    selectAmenities.push(options);
                }

                setValue("amenities", selectAmenities || []);
                setFiles(imageFiles);
                setValue("occupancy", room.occupancy || {});
                setValue("price", room.price || {});
            }
        } catch (error) {
            handleCatch(error);
        }
    };


    const getCities = async (state) => {
        if (state?.value) {
            setCities(await fetchCities(state?.value));
        }
    }

    const fetchInitialData = async () => {
        const amenitiesData = await fetchAmenities();
        const statesData = await fetchStates();
        console.log("amenitiesData: ", amenitiesData.length);
        setAmenities(amenitiesData);
        setStates(statesData);

        await getCities(statesData[0]);

        if (roomId) {
            await fetchRoom(amenitiesData);
        }
    };


    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        setValue("images", files, { shouldValidate: true });
    }, [files]);

    const addRemoveFile = (file, method, index) => {
        let updatedFiles = [...files];

        if (method === "REMOVE") {
            updatedFiles.splice(index, 1);
            if (file?.isAlreadyUploaded) {
                setRemoveAttachments(prev => [...prev, file]);
            }
        } else if (method === "ADD") {
            file[0].toUpload = true;
            updatedFiles = [...updatedFiles, ...file];
        }
        setFiles(updatedFiles);
        console.log(updatedFiles.length);
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} id="room" className="container py-4 px-2">

            <h2 className="mb-4 fw-bold pb-2">🏠 {roomId ? 'Edit Room' : 'Add a New Room'}</h2>
            <section className="mb-4">
                <h5 className="fw-semibold mb-3 text-uppercase text-muted">Room Info</h5>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Building Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.title ? "is-invalid" : ""}`}
                            {...register("title", { required: "Building Name is required" })}
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Room Number</label>
                        <input
                            type="number"
                            className={`form-control ${errors.roomNo ? "is-invalid" : ""}`}
                            {...register("roomNo", { required: "Room Number is required" })}
                        />
                        {errors.roomNo && <div className="invalid-feedback">{errors.roomNo.message}</div>}
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="mb-4">
                <h5 className="fw-semibold mb-3 text-uppercase text-muted">Location</h5>

                <LocationPicker onChange={handlePlace} latitude={getValues("latitude") || 28.6139} longitude={getValues("longitude") || 77.209} showSearch={true} />

                <div className="row g-3 mt-3">
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
                                    onChange={(value) => { field.onChange(value); getCities(value) }}
                                    error={errors.state}
                                    isMulti={false}
                                />
                            )}
                        />
                    </div>
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
                                    error={errors.city}
                                    isMulti={false}
                                />
                            )}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Pincode</label>
                        <input
                            type="text"
                            className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                            {...register("pincode", {
                                required: "Pincode is required",
                                pattern: { value: /^\d{6}$/, message: "Must be 6 digits" },
                            })}
                        />
                        {errors.pincode && <div className="invalid-feedback">{errors.pincode.message}</div>}
                    </div>
                </div>

                <input type="hidden" {...register("latitude", { required: true })} />
                <input type="hidden" {...register("longitude", { required: true })} />
            </section>

            {/* Images */}
            <section className="mb-4">
                <h5 className="fw-semibold mb-3 text-uppercase text-muted">Images</h5>
                <Controller
                    name="images"
                    control={control}
                    rules={{
                        validate: () => {
                            if (files.length === 0) return "At least one image is required";
                            if (files.length !== 5) return "You must upload exactly 5 images";
                            return true;
                        }
                    }}
                    render={({ }) => (
                        <FileUploader
                            label="Upload Images (Equal To 5)"
                            accept="image/*"
                            maxFiles={5}
                            value={files}
                            onFileAdd={(file, method) => { addRemoveFile(file, method) }}
                            onFileRemove={(file, method, index) => { addRemoveFile(file, method, index) }}
                            error={errors.images}
                        />
                    )}
                />
            </section>

            {/* Description & Amenities */}
            <section className="mb-4">
                <h5 className="fw-semibold mb-3 text-uppercase text-muted">About Room</h5>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        rows="6"
                        {...register("description", { required: "Description is required" })}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                </div>

                <div>
                    <Controller
                        name="amenities"
                        control={control}
                        rules={{ required: "Select at least one amenity" }}
                        render={({ field }) => (
                            <MultiSelectDropdown
                                label="Amenities"
                                options={amenities}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.amenities}
                            />
                        )}
                    />
                </div>
            </section>

            {/* Guest Size */}
            <section className="mb-4">
                <h5 className="fw-semibold mb-3 text-uppercase text-muted">Occupancy</h5>
                <div className="row g-3">
                    {["guest", "bed", "bath", "bedRoom", "pet"].map((key) => (
                        <div className="col-md-3" key={key}>
                            <label className="form-label">Number Of {key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <Controller
                                name={`occupancy.${key}`}
                                control={control}
                                rules={{ required: true, min: 0 }}
                                render={({ field }) => (
                                    <input
                                        type="number"
                                        className={`form-control ${errors.occupancy?.[key] ? "is-invalid" : ""}`}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.occupancy?.[key] && <div className="text-danger">Required</div>}
                        </div>
                    ))}
                </div>
            </section>

            {/* Price Section */}
            <section className="mb-4">
                <h5 className="fw-semibold mb-3 text-uppercase text-muted">Pricing</h5>
                <div className="row g-3">
                    {["base", "guest", "pet"].map((key) => (
                        <div className="col-md-3" key={key}>
                            <label className="form-label">{key === "base" ? "Base Price" : `Price per ${key}`}</label>
                            <Controller
                                name={`price.${key}`}
                                control={control}
                                rules={{ required: true, min: 0 }}
                                render={({ field }) => (
                                    <input
                                        type="number"
                                        className={`form-control ${errors.price?.[key] ? "is-invalid" : ""}`}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.price?.[key] && <div className="text-danger">Required</div>}
                        </div>
                    ))}
                </div>
            </section>

            <div className="mt-4 text-end">
                <button type="submit" className="btn btn-success px-4 py-2">
                    Submit Room
                </button>
            </div>
        </form>

    );
};

export default CreateEditRoom;

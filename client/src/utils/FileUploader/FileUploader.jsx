import { useRef } from "react";
import { toast } from "react-toastify";

const FileUploader = ({
    label = "Upload Files",
    maxFiles = 5,
    accept = "image/*",
    value = [],
    onFileAdd,
    onFileRemove,
    error
}) => {
    const fileInputRef = useRef();

    const handleFiles = (e) => {

        const selectedFiles = Array.from(e.target.files);
        const newFiles = [...value, ...selectedFiles];

        if (newFiles.length > maxFiles) {
            return toast.error(`You can only upload up to ${maxFiles} files`);
        }
        selectedFiles.toUpload = true;
        onFileAdd(selectedFiles, "ADD");
        e.target.value = "";
    };

    const handleRemove = (index) => {
        const updated = [...value];
        const file = updated[index];
        onFileRemove(file, "REMOVE", index);
    };

    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>

            <div className="d-flex flex-wrap gap-2">
                {value.map((file, index) => (
                    <div
                        key={index}
                        className="position-relative border p-2 rounded bg-light"
                        style={{ width: "100px", height: "100px", overflow: "hidden" }}
                    >
                        {file.type.startsWith("image") ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="img-fluid h-100 w-100 object-fit-cover"
                            />
                        ) : (
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <i className="bi bi-file-earmark-text fs-3"></i>
                            </div>
                        )}
                        <button
                            type="button"
                            className="btn-close position-absolute top-0 end-0 m-1"
                            onClick={() => handleRemove(index)}
                        ></button>
                    </div>
                ))}

                {value.length < maxFiles && (
                    <div
                        className="border rounded d-flex justify-content-center align-items-center"
                        style={{ width: "100px", height: "100px", cursor: "pointer" }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <i className="bi bi-plus-lg fs-3"></i>
                    </div>
                )}
            </div>

            <input
                type="file"
                multiple
                accept={accept}
                ref={fileInputRef}
                onChange={handleFiles}
                hidden
            />

            {error && <div className="text-danger mt-2">{error.message}</div>}
        </div>
    );
};

export default FileUploader;
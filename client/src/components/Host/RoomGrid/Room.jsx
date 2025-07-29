import React from "react";
import RoomGrid from "../../RoomGrid/RoomGrid";
import { useNavigate } from "react-router-dom";

const HostRoomGrid = () => {
    const navigate = useNavigate();

    const handleAddRoom = () => {
        navigate("/host/rooms/add");
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Rooms</h1>
                <button className="btn btn-primary" onClick={handleAddRoom}>
                    <i className="bi bi-house-add me-2"></i> Add Room
                </button>
            </div>

            <div className="d-flex justify-content-end mb-4">
                <div className="input-group w-50">
                    <span className="input-group-text bg-white">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search rooms by name, location, etc."
                    />
                </div>
            </div>

            <RoomGrid />
        </>
    );
};

export default HostRoomGrid;

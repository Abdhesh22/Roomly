import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Table from "../../../utils/Table/Table";
import api from "../../../utils/request/api.util";
import { debounce, handleCatch } from "../../../utils/common";
import ConfirmModal from "../../../utils/modal/ConfirmationModal";
import { toast } from 'react-toastify';

const RoomList = () => {

    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchKey, setSearchKey] = useState("");
    const [sortKey, setSortKey] = useState("createdOn");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        message: "",
        confirmText: "Confirm",
        onConfirm: () => { },
    });


    const columns = [
        { header: "Title", accessor: "title" },
        { header: "Base Price", accessor: "price" },
        { header: "State", accessor: "state" },
        { header: "City", accessor: "city" },
        { header: "Pincode", accessor: "pincode" },
        { header: "Guests", accessor: "guests" }
    ];

    const actions = [
        {
            label: (row) => <i className="bi bi-eye me-1 text-success" title="View"></i>,
            onClick: (row) => navigate(`/host/rooms/view/${row._id}`),
        },
        {
            label: (row) => (
                <span className="text-primary" title="Edit">
                    <i className="bi bi-pencil" /> Edit
                </span>
            ),
            onClick: (row) => navigate(`/host/rooms/edit/${row._id}`),
        },
        {
            label: (row) => (
                <span
                    className={`text-${row.status === 'MAINTENANCE' ? 'success' : 'warning'}`}
                    title={row.status === 'MAINTENANCE' ? 'Mark as Active' : 'Mark as Maintenance'}
                >
                    <i className="bi bi-wrench-adjustable" />{" "}
                    {row.status === 'MAINTENANCE' ? 'Activate' : 'Maintain'}
                </span>
            ),
            onClick: (row) => handleMaintenanceClick(row),
        },
        {
            label: (row) => (<i className="bi bi-trash text-danger" title="Delete"></i>),
            onClick: (row) => handleDeleteClick(row),
        },
    ];


    const fetchRooms = useCallback(async () => {
        try {

            const { data } = await api.get('/api/rooms', {
                skip: page,
                limit,
                sortKey,
                order: sortOrder,
                searchKey
            });
            if (data.status) {
                setTotal(data.length || 0);
                setRooms(data.list || []);
            }
        } catch (error) {
            handleCatch(error);
        }
    }, [page, limit, sortKey, sortOrder, searchKey]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const searchRooms = debounce((value) => {
        setSearchKey(value);
        setPage(1);
    }, 500);

    const pagination = {
        page,
        limit,
        total,
        onPageChange: (newPage) => {
            setPage(newPage);
        },
    };

    const handleAddRoom = () => {
        navigate("/host/rooms/add");
    };


    const updateStatus = async (room, status) => {
        try {
            const { data } = await api.delete(`/api/rooms/${room._id}/status/${status}`);
            if (data.status) {
                toast.success(data.message);
                setShowConfirm(false);
                fetchRooms();
            }
        } catch (error) {
            handleCatch(error);
        }
    }

    const openConfirmModal = ({ title, message, confirmText, onConfirm }) => {
        setModalData({ title, message, confirmText, onConfirm });
        setShowConfirm(true);
    };

    const handleDeleteClick = (room) => {
        openConfirmModal({
            title: "Confirm Delete",
            message: `Are you sure you want to delete "${room.title}"?`,
            confirmText: "Delete",
            onConfirm: () => updateStatus(room, "DELETE"),
        });
    };

    const handleMaintenanceClick = (room) => {
        const action = room.status === "MAINTENANCE" ? "activate" : "set to maintenance";
        openConfirmModal({
            title: "Change Room Status",
            message: `Are you sure you want to ${action} "${room.title}"?`,
            confirmText: "Yes",
            onConfirm: () => updateStatus(room, room.status === "MAINTENANCE" ? 'ACTIVE' : "MAINTENANCE"),
        });
    };

    const cancelConfirm = () => {
        setShowConfirm(false);
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
                        onInput={(e) => searchRooms(e.target.value)}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                data={rooms}
                enableSorting={true}
                actions={actions}
                pagination={pagination}
                sortTable={(key, order) => {
                    setSortKey(key);
                    setSortOrder(order);
                }}
            />

            <ConfirmModal
                show={showConfirm}
                title={modalData.title}
                message={modalData.message}
                onConfirm={() => {
                    modalData.onConfirm();
                    setShowConfirm(false);
                }}
                onCancel={cancelConfirm}
                confirmText={modalData.confirmText}
                cancelText="Cancel"
            />

        </>
    );
};

export default RoomList;
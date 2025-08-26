import "../../../assets/style/Room.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAmenities, handleCatch } from "../../../utils/common";
import api from "../../../utils/request/api.util";
import CustomLocationPicker from "../CustomComponent/CustomLocationPicker/CustomLocationPicker";
import Amenities from "../Room/Amenities/Amenities";
import BackButton from "../CustomComponent/BackButton";
import Loader from "../CustomComponent/Loader";
const Room = ({ showReservation }) => {

  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState({});
  const [loader, setLoader] = useState(true);

  let amenitiesList = [];

  const fetchRoom = async () => {
    try {

      const res = await api.get(`/api/rooms/detail/${roomId}`);
      if (res.data.status) {

        const selectAmenities = res.data.room.amenities;
        amenitiesList = amenitiesList.filter(item => selectAmenities.includes(item.value));
        res.data.room.amenities = amenitiesList;

        setRoom(res.data.room);
      }

      setLoader(false);
    } catch (error) {
      handleCatch(error);
    }
  };

  const handleNavigate = (route) => navigate(route);
  const run = async () => {
    const list = await fetchAmenities();
    amenitiesList = list;
    await fetchRoom();
  };
  useEffect(() => {
    run();
  }, [roomId]);

  const getRoomOccupancy = () => {

    let occupancy = room.occupancy;
    let occupancyStr = '';

    if (occupancy) {
      for (let key in occupancy) {
        occupancyStr += `${occupancy[key]} ${key} `;
      }
    }

    return occupancyStr;
  }

  return (
    <div className="container">
      {loader && <Loader show={loader} message="Loading Room Detail..."></Loader>}
      {!loader && (<>
        <div className="d-flex justify-content-between align-items-center mb-4 room-title">
          {/* Left side: Title */}
          <h2 className="mb-0">
            {room?.title?.length > 35 ? room.title.slice(0, 35) + "..." : room.title}
          </h2>


          {/* Right side: Back + Reservation buttons */}
          <div className="d-flex align-items-center gap-2">
            <BackButton />

            {showReservation && (
              <button
                className="btn btn-outline-primary d-flex align-items-center gap-2 rounded-3 shadow-sm"
                onClick={() => handleNavigate(`/reservation/${roomId}`)}
              >
                Go to Reservation
                <i className="bi bi-arrow-right-square-fill"></i>
              </button>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {room.attachments?.length > 0 ? (
          <div className="row g-2 mb-4 image-gallery">
            <div className="col-md-6">
              <img
                src={room.attachments[0].remotePath}
                alt={room.attachments[0].originalFileName || "Room Image"}
                className="img-fluid rounded cover-img full-height"
              />
            </div>
            {[1, 3].map((start, colIndex) => (
              <div key={colIndex} className="col-md-3 d-flex flex-column gap-2">
                {[0, 1].map((offset) => {
                  const i = start + offset;
                  return room.attachments?.[i] ? (
                    <img
                      key={i}
                      src={room.attachments[i].remotePath}
                      alt={room.attachments[i].originalFileName || "Room Image"}
                      className="img-fluid rounded cover-img half-height"
                    />
                  ) : null;
                })}
              </div>
            ))}
          </div>
        ) : (
          <p>No images available for this room.</p>
        )}

        {/* Room Details */}
        <div className="row">
          <div className="col-md-6">
            {/* Host */}
            <div className="d-flex align-items-center mb-3">
              {room.host?.[0]?.profileAttachment?.remotePath && (<img
                src={room.host?.[0]?.profileAttachment?.remotePath}
                alt="Host Avatar"
                className="host-avatar me-3"
              />)}
              <div>
                <h5 className="mb-0">
                  Entire rental unit hosted by{" "}
                  {room.host?.[0]
                    ? `${room.host[0].firstName} ${room.host[0].lastName}`
                    : "Host"}
                </h5>
                <small className="text-muted">{getRoomOccupancy()}</small>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5>About this place</h5>
              <p className="text-muted">{room?.description || "No description provided."}</p>
            </div>

            {/* Amenities */}
            {room?.amenities?.length > 0 && <Amenities list={room?.amenities} />}
          </div>

          <div className="col-md-6">
            {room.location && (
              <CustomLocationPicker
                latitude={room.location.latitude}
                longitude={room.location.longitude}
                title={`Address: ${room.location.state} ${room.location.city}, ${room.location.pincode}`}
                disable={true}
              />
            )}
          </div>
        </div>
      </>)}

    </div>
  );
};

export default Room;
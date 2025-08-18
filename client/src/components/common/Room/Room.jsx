import "../../../assets/style/Room.css";
import { useNavigate, useParams } from "react-router-dom";
import Amenities from "./Amenities/Amenities";
import { useEffect, useState } from "react";
import { handleCatch } from "../../../utils/common";
import api from "../../../utils/request/api.util";
import CustomLocationPicker from "../CustomComponent/CustomLocationPicker/CustomLocationPicker";

const Room = ({ showReservation }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState({});

  const fetchRoom = async () => {
    try {
      const res = await api.get(`/api/rooms/detail/${roomId}`);


      const amenitiesList = [
        { value: "wifi", title: "Wi-Fi", iconClass: "bi bi-wifi", description: "Stay connected with high-speed internet." },
        { value: "ac", title: "Air Conditioning", iconClass: "bi bi-wind", description: "Beat the heat with A/C and ceiling fan." },
        { value: "pool", title: "Swimming Pool", iconClass: "bi bi-water", description: "Relax and refresh in the pool." },
        { value: "kitchen", title: "Kitchen", iconClass: "bi bi-cup-straw", description: "Cook your meals with ease." },
        { value: "tv", title: "TV", iconClass: "bi bi-tv", description: "Enjoy your favorite shows and movies." },
        { value: "parking", title: "Parking", iconClass: "bi bi-car-front-fill", description: "Secure parking available on-site." },
        { value: "gym", title: "Gym", iconClass: "bi bi-heart-pulse", description: "Stay fit with our modern gym." }]


      if (res.data.status) {
        res.data.room.amenities = amenitiesList;
        setRoom(res.data.room);
      }
    } catch (error) {
      handleCatch(error);
    }
  };

  const handleNavigate = (route) => navigate(route);

  useEffect(() => {
    fetchRoom();
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
    <div className="container mb-5">
      {/* Title + Reservation Button */}
      <div className="d-flex justify-content-between align-items-center mb-4 room-title">
        <h2 className="mb-0">{"Modern Cozy Apartment in Downtown"}</h2>
        {showReservation && (<>
          <button
            className="btn btn-outline-primary d-flex align-items-center gap-2 py-2 px-3 rounded-3 shadow-sm w-30"
            onClick={() => handleNavigate(`/reservation/${roomId}`)}
          >
            Go to Reservation
            <i className="bi bi-arrow-right-square-fill fs-4"></i>
          </button>
        </>
        )}
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
            <img
              src={room.host?.[0]?.avatar || "/default-host.png"}
              alt="Host Avatar"
              className="host-avatar me-3"
            />
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
          {room?.amenities?.length > 0 && <Amenities list={room.amenities} />}
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
    </div>
  );
};

export default Room;
import { useEffect, useState, useCallback } from "react";
import RoomCard from "../user/RoomCard";
import api from "../../utils/request/api.util";
import { handleCatch, debounce } from "../../utils/common";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sortKey = "createdAt";
  const sortOrder = "desc";

  const fetchRooms = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data } = await api.get("/api/rooms/grid", {
        skip: page,
        limit,
        sortKey,
        order: sortOrder,
        searchKey,
      });

      if (data.status) {
        const newRooms = data.list || [];
        console.log("newRooms: ", newRooms);
        setRooms((prev) => (page === 1 ? newRooms : [...prev, ...newRooms]));
        if (newRooms.length < limit) setHasMore(false);
      }
    } catch (error) {
      handleCatch(error);
    } finally {
      setLoading(false);
    }
  };

  const searchRooms = debounce((value) => {
    setHasMore(true);
    setPage(1);
    setSearchKey(value);
  }, 500);

  const scrollHandler = useCallback((e) => {
    if (loading || !hasMore) return;

    const target = e.target; // main element
    const scrollPosition = target.scrollTop + target.clientHeight;
    const threshold = target.scrollHeight - 200;

    if (scrollPosition >= threshold) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    fetchRooms();
  }, [page, searchKey]);

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (!mainEl) return;

    mainEl.addEventListener("scroll", scrollHandler);
    return () => mainEl.removeEventListener("scroll", scrollHandler);
  }, [scrollHandler]);

  return (
    <div className="container py-3">
      {/* Search */}
      <div className="d-flex justify-content-center mb-4 flex-wrap">
        <div className="d-flex flex-column w-100 w-lg-50">
          <label className="form-label fw-semibold text-secondary mb-2">
            Search Rooms
          </label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control ps-5 py-2 shadow-sm rounded-pill border-light"
              placeholder="Search by name, location, ..."
              onInput={(e) => searchRooms(e.target.value)}
            />
            <i
              className="bi bi-search text-muted position-absolute top-50 start-0 translate-middle-y ms-3"
              style={{ fontSize: "1rem" }}
            ></i>
          </div>
        </div>
      </div>

      {/* Rooms */}
      <div className="row">
        {rooms.map((room, index) => (
          <RoomCard
            roomId={room._id}
            title={room.title}
            description={room.description}
            state={room.location.state}
            city={room.location.city}
            imageSrc={room.image.remotePath}
            host={room.host}
            price={room.price.base}
            key={index}
            type={room.type}
          />
        ))}
      </div>

      {/* Loader / End */}
      {loading && <div className="text-center my-3">Loading...</div>}
      {!hasMore && (
        <div className="position-relative text-center my-5">
          <div className="border-top border-gradient"></div>
          <span className="position-absolute top-50 start-50 translate-middle px-4 py-2 bg-white border rounded-pill shadow-sm text-muted small fw-medium">
            <i className="bi bi-house-heart me-2 text-danger"></i>
            No more rooms
          </span>
        </div>
      )}

    </div>
  );
};

export default Home;
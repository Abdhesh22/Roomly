import { useEffect, useState, useCallback, useRef } from "react";
import RoomCard from "../user/RoomCard";
import api from "../../utils/request/api.util";
import { handleCatch, debounce } from "../../utils/common";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef(null);
  const sortKey = "createdAt";
  const sortOrder = "desc";

  const fetchRooms = async () => {
    if (loading || !hasMore) {
      console.log("stopped rooms");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/api/rooms/grid', {
        skip: page,
        limit,
        sortKey,
        order: sortOrder,
        searchKey: searchKey,
      });

      if (data.status) {
        const newRooms = data.list || [];
        setRooms((prev) => (page === 1 ? newRooms : [...prev, ...newRooms]));
        if (newRooms.length < limit) setHasMore(false);
      }
    } catch (error) {
      handleCatch(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Search handler
  const searchRooms = debounce((value) => {
    setHasMore(true);
    setSearchKey(value);
  }, 500);

  // 🔹 Infinite scroll handler
  const scrollHandler = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return;

    const container = containerRef.current;
    const scrollThreshold = 200;

    if (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      scrollThreshold
    ) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    setPage(1);
    fetchRooms();
  }, [searchKey])

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", scrollHandler);
    return () => container.removeEventListener("scroll", scrollHandler);
  }, [scrollHandler]);

  return (
    <div className="container" ref={containerRef}>
      <div className="d-flex justify-content-end align-items-end mb-4 gap-3 flex-wrap">
        <div className="d-flex flex-column w-100 w-md-50">
          <label className="form-label fw-semibold text-secondary mb-1">
            Search
          </label>
          <div className="input-group shadow-sm rounded-3 overflow-hidden">
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0"
              placeholder="Search rooms by name, location, etc."
              onInput={(e) => searchRooms(e.target.value)}
            />
          </div>
        </div>
      </div>

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

      {loading && <div className="text-center my-3">Loading...</div>}
      {!hasMore && <div className="text-center my-3">No more rooms to load</div>}
    </div>
  );
};

export default Home;
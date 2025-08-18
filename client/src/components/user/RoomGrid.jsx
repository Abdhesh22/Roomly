import { useEffect, useState, useCallback, useRef } from "react";
import RoomCard from "./RoomCard";
import api from "../../utils/request/api.util";
import { handleCatch } from "../../utils/common";

const RoomGrid = ({ options }) => {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef(null);
  const isPageLoad = useRef(false);
  const sortKey = options?.sortKey || "createdAt";
  const sortOrder = options?.sortOrder || "desc";
  const searchKey = options?.searchKey || "";

  const fetchRooms = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data } = await api.get('/api/rooms/grid', {
        skip: page,
        limit,
        sortKey,
        order: sortOrder,
        searchKey
      });

      if (data.status) {
        const newRooms = data.list || [];
        setRooms((prev) => [...prev, ...newRooms]);
        if (newRooms.length < limit) setHasMore(false);
      }
    } catch (error) {
      handleCatch(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortKey, sortOrder, searchKey, loading, hasMore]);

  // Fetch first page or on search change
  useEffect(() => {
    setRooms([]);
    setPage(1);
    setHasMore(true);
  }, [searchKey, sortKey, sortOrder]);

  // Fetch when page changes
  useEffect(() => {
    if (isPageLoad.current) return;
    isPageLoad.current = true;
    fetchRooms();
  }, [fetchRooms]);

  // Infinite scroll handler
  const scrollHandler = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return;

    const container = containerRef.current;
    const scrollThreshold = 200;

    if (container.scrollHeight - container.scrollTop - container.clientHeight < scrollThreshold) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", scrollHandler);
    return () => container.removeEventListener("scroll", scrollHandler);
  }, [scrollHandler]);

  return (
    <div
      className="container"
      ref={containerRef}
    >
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

export default RoomGrid;

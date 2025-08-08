import { useState, useRef, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const apiKey = import.meta.env.VITE_LOCATION_IQ_API_KEY;


const SetMapRef = ({ onReady }) => {
    const map = useMap();

    useEffect(() => {
        if (map) onReady(map);
    }, [map]);

    return null;
};


const CustomLocationPicker = ({ onChange, latitude, longitude, title = "Pick a Location", disable = false }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [position, setPosition] = useState([latitude, longitude]);
    const mapRef = useRef(null);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length < 3) return setSuggestions([]);

        try {
            const res = await fetch(
                `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${value}&limit=5&format=json&accept-language=en`
            );

            const data = await res.json()
            setSuggestions(data);
        } catch (error) {
            setSuggestions([]);
        }
    };

    const handleSelect = (place) => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        setPosition([lat, lon]);
        setQuery(place.display_name);
        setSuggestions([]);

        const city = place.address.city || place.address.town || place.address.village || place.address.hamlet ||
            place.address.county || place.address.state_district || "";

        place.address.city = city;
        onChange({ latitude: lat, longitude: lon, address: place.address });
    };


    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.flyTo(position, 14);
        }
    }, [position]);


    const getAddressFromLatLng = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json&accept-language=en`
            );
            const place = await response.json();
            const city = place.address.city || place.address.town || place.address.village || place.address.hamlet ||
                place.address.county || place.address.state_district || "";

            place.address.city = city;

            onChange({ latitude: parseFloat(place.lat), longitude: parseFloat(place.lon), address: place.address });
        } catch (error) {
            throw error;
        }
    };



    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                if (disable) return;
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                setQuery(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
                setSuggestions([]);
                getAddressFromLatLng(lat, lng)
            },
        });

        return <Marker position={position} />;
    };

    return (
        <div className="mb-3">
            <label className="form-label">{title}</label>
            <div style={{ position: "relative" }}>
                {!disable && (<div
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1000,
                        width: "250px"
                    }}
                >
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search location..."
                        value={query}
                        onChange={handleSearch}
                    />
                    {suggestions.length > 0 && (
                        <ul
                            style={{
                                background: "#fff",
                                maxHeight: "150px",
                                overflowY: "auto",
                                border: "1px solid #ddd",
                                padding: 0,
                                margin: 0,
                                listStyle: "none",
                                borderTop: "none"
                            }}
                        >
                            {suggestions.map((place, index) => (
                                <li
                                    key={index}
                                    style={{
                                        padding: "8px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #eee"
                                    }}
                                    onClick={() => handleSelect(place)}
                                >
                                    {place.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>)}
                {/* 🗺️ Map */}
                <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "700px", marginTop: "10px", position: "relative" }}
                >
                    <SetMapRef onReady={(map) => (mapRef.current = map)} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='Map data © <a href="https://locationiq.com/">LocationIQ</a> & OpenStreetMap contributors'
                    />
                    <LocationMarker />
                </MapContainer>
            </div>
        </div>
    );
};

export default CustomLocationPicker;

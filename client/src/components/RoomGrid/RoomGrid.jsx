import { useState } from "react";
import "../../assets/style/card.css";
import RoomCard from "../Card/RoomCard";

const RoomGrid = ({ options }) => {

  console.log("calling rooms");

  const [rooms, setRooms] = useState([
    {
      id: 1,
      title: "Room in Satri",
      host: "Sunder",
      years: 10,
      location: "Room with a view in Binsar Wildlife Sanctuary",
      price: 9900,
      nights: 5,
      image:
        "https://a0.muscache.com/im/pictures/miso/Hosting-44546056/original/debdcef5-2000-4f9e-baba-bf939effcad6.jpeg?im_w=720",
    },
    {
      id: 2,
      title: "Cozy Room in Jaipur",
      host: "Priya",
      years: 5,
      location: "Near Amber Fort, Jaipur",
      price: 7500,
      nights: 3,
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/2a/6e/96/caption.jpg?w=1400&h=-1&s=1",
    },
    {
      id: 3,
      title: "Hill View Cottage",
      host: "Ravi",
      years: 2,
      location: "Nainital Hillside Stay",
      price: 8200,
      nights: 4,
      image:
        "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-jaipur-rajasthan-2-attr-hero?qlt=82&ts=1742161239064",
    },
    {
      id: 4,
      title: "Cozy Room in Jaipur",
      host: "Priya",
      years: 5,
      location: "Near Amber Fort, Jaipur",
      price: 7500,
      nights: 3,
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/2a/6e/96/caption.jpg?w=1400&h=-1&s=1",
    },
    {
      id: 5,
      title: "Hill View Cottage",
      host: "Ravi",
      years: 2,
      location: "Nainital Hillside Stay",
      price: 8200,
      nights: 4,
      image:
        "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-jaipur-rajasthan-2-attr-hero?qlt=82&ts=1742161239064",
    },
    {
      id: 6,
      title: "Cozy Room in Jaipur",
      host: "Priya",
      years: 5,
      location: "Near Amber Fort, Jaipur",
      price: 7500,
      nights: 3,
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/2a/6e/96/caption.jpg?w=1400&h=-1&s=1",
    },
    {
      id: 7,
      title: "Hill View Cottage",
      host: "Ravi",
      years: 2,
      location: "Nainital Hillside Stay",
      price: 8200,
      nights: 4,
      image:
        "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-jaipur-rajasthan-2-attr-hero?qlt=82&ts=1742161239064",
    },
    {
      id: 8,
      title: "Cozy Room in Jaipur",
      host: "Priya",
      years: 5,
      location: "Near Amber Fort, Jaipur",
      price: 7500,
      nights: 3,
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/2a/6e/96/caption.jpg?w=1400&h=-1&s=1",
    },
    {
      id: 9,
      title: "Hill View Cottage",
      host: "Ravi",
      years: 2,
      location: "Nainital Hillside Stay",
      price: 8200,
      nights: 4,
      image:
        "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-jaipur-rajasthan-2-attr-hero?qlt=82&ts=1742161239064",
    },
    {
      id: 10,
      title: "Hill View Cottage",
      host: "Ravi",
      years: 2,
      location: "Nainital Hillside Stay",
      price: 8200,
      nights: 4,
      image:
        "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-jaipur-rajasthan-2-attr-hero?qlt=82&ts=1742161239064",
    },
    {
      id: 11,
      title: "Hill View Cottage",
      host: "Ravi",
      years: 2,
      location: "Nainital Hillside Stay",
      price: 8200,
      nights: 4,
      image:
        "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-jaipur-rajasthan-2-attr-hero?qlt=82&ts=1742161239064",
    },
    {
      id: 12,
      title: "Hill View Cottage",
      host: "Ravi",
      years: 2,
      location: "Nainital Hillside Stay",
      price: 8200,
      nights: 4,
      image:
        "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-jaipur-rajasthan-2-attr-hero?qlt=82&ts=1742161239064",
    },
  ]);
  return (
    <>
      <div className="container">
        <div className="row">
          {rooms.map((room, index) => (
            <RoomCard options={room} key={index}></RoomCard>
          ))}
        </div>
      </div>
    </>
  );
};

export default RoomGrid;

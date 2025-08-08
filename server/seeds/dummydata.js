const dummyRooms = [
    {
        title: "Cozy Private Room near City Center",
        roomNo: 101,
        description: "A comfortable private room ideal for solo travelers or students.",
        // hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc123456"),
        type: "room",
        location: {
            state: "Delhi NCR",
            city: "Delhi",
            pincode: "110001",
            latitude: "28.6139",
            longitude: "77.2090"
        },
        price: {
            base: "1200",
            guest: "300",
            pet: "200"
        },
        occupancy: {
            guest: 1,
            bed: 1,
            pet: 0,
            bath: 1,
            bedRoom: 1
        },
        amenities: ["WiFi", "AC", "Shared Kitchen"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "room1.jpg",
                remotePath: "room-images/room1.jpg",
                remoteId: "room-images/room1",
                mimetype: "image/jpeg",
                size: 34567
            }
        ]
    },
    {
        title: "Spacious Family House with Garden",
        roomNo: 102,
        description: "Perfect for families, this house includes a lush garden and parking.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc123457"),
        type: "house",
        location: {
            state: "Maharashtra",
            city: "Mumbai",
            pincode: "400001",
            latitude: "18.9388",
            longitude: "72.8354"
        },
        price: {
            base: "5500",
            guest: "800",
            pet: "500"
        },
        occupancy: {
            guest: 6,
            bed: 3,
            pet: 2,
            bath: 2,
            bedRoom: 3
        },
        amenities: ["Parking", "WiFi", "Washer", "Pet Friendly"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "house1.jpg",
                remotePath: "room-images/house1.jpg",
                remoteId: "room-images/house1",
                mimetype: "image/jpeg",
                size: 51234
            }
        ]
    },
    {
        title: "Modern Apartment in Tech Park Area",
        roomNo: 303,
        description: "Ideal for working professionals, close to offices and shopping.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc123458"),
        type: "apartment",
        location: {
            state: "Karnataka",
            city: "Bangalore",
            pincode: "560103",
            latitude: "12.9352",
            longitude: "77.6144"
        },
        price: {
            base: "3500",
            guest: "400",
            pet: "250"
        },
        occupancy: {
            guest: 3,
            bed: 2,
            pet: 1,
            bath: 2,
            bedRoom: 2
        },
        amenities: ["Elevator", "Security", "Gym", "WiFi"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "apt1.jpg",
                remotePath: "room-images/apt1.jpg",
                remoteId: "room-images/apt1",
                mimetype: "image/jpeg",
                size: 42200
            }
        ]
    },
    {
        title: "Beachside Villa with Private Pool",
        roomNo: 401,
        description: "Luxury villa facing the beach with private amenities.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc123459"),
        type: "villa",
        location: {
            state: "Goa",
            city: "Panaji",
            pincode: "403001",
            latitude: "15.4909",
            longitude: "73.8278"
        },
        price: {
            base: "9500",
            guest: "1000",
            pet: "700"
        },
        occupancy: {
            guest: 8,
            bed: 4,
            pet: 2,
            bath: 3,
            bedRoom: 4
        },
        amenities: ["Private Pool", "Chef", "WiFi", "Pet Friendly"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "villa1.jpg",
                remotePath: "room-images/villa1.jpg",
                remoteId: "room-images/villa1",
                mimetype: "image/jpeg",
                size: 60789
            }
        ]
    },
    {
        title: "Cozy Private Room in South Delhi",
        roomNo: 1,
        description: "Perfect for a solo traveler, includes fast WiFi and a shared kitchen.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc100001"),
        type: "room",
        location: {
            state: "Delhi NCR",
            city: "Delhi",
            pincode: "110025",
            latitude: "28.5618",
            longitude: "77.2809"
        },
        price: {
            base: "1100",
            guest: "200",
            pet: "0"
        },
        occupancy: {
            guest: 1,
            bed: 1,
            pet: 0,
            bath: 1,
            bedRoom: 1
        },
        amenities: ["WiFi", "Shared Kitchen", "Work Desk"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "room1.jpg",
                remotePath: "room-images/room1.jpg",
                remoteId: "room-images/room1",
                mimetype: "image/jpeg",
                size: 34567
            }
        ]
    },
    {
        title: "Modern Family House in Andheri",
        roomNo: 2,
        description: "Spacious 3BHK with garden, parking and inverter backup.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc100002"),
        type: "house",
        location: {
            state: "Maharashtra",
            city: "Mumbai",
            pincode: "400053",
            latitude: "19.1317",
            longitude: "72.8448"
        },
        price: {
            base: "4800",
            guest: "500",
            pet: "300"
        },
        occupancy: {
            guest: 5,
            bed: 3,
            pet: 2,
            bath: 2,
            bedRoom: 3
        },
        amenities: ["Parking", "Garden", "Washer", "Pet Friendly"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "house1.jpg",
                remotePath: "room-images/house1.jpg",
                remoteId: "room-images/house1",
                mimetype: "image/jpeg",
                size: 41256
            }
        ]
    },
    {
        title: "2BHK Apartment near Manyata Tech Park",
        roomNo: 3,
        description: "Ideal for IT professionals, fully furnished and gated community.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc100003"),
        type: "apartment",
        location: {
            state: "Karnataka",
            city: "Bangalore",
            pincode: "560045",
            latitude: "13.0376",
            longitude: "77.6187"
        },
        price: {
            base: "3200",
            guest: "400",
            pet: "150"
        },
        occupancy: {
            guest: 4,
            bed: 2,
            pet: 1,
            bath: 2,
            bedRoom: 2
        },
        amenities: ["Elevator", "Security", "WiFi"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "apt2.jpg",
                remotePath: "room-images/apt2.jpg",
                remoteId: "room-images/apt2",
                mimetype: "image/jpeg",
                size: 38214
            }
        ]
    },
    {
        title: "Beachside Villa in North Goa",
        roomNo: 4,
        description: "Exclusive villa with infinity pool and private beach access.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc100004"),
        type: "villa",
        location: {
            state: "Goa",
            city: "North Goa",
            pincode: "403509",
            latitude: "15.5600",
            longitude: "73.7500"
        },
        price: {
            base: "8500",
            guest: "1000",
            pet: "500"
        },
        occupancy: {
            guest: 6,
            bed: 3,
            pet: 2,
            bath: 3,
            bedRoom: 3
        },
        amenities: ["Private Pool", "Beach Access", "Chef On Call"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "villa2.jpg",
                remotePath: "room-images/villa2.jpg",
                remoteId: "room-images/villa2",
                mimetype: "image/jpeg",
                size: 59500
            }
        ]
    },
    {
        title: "Scenic Farmhouse near Nashik",
        roomNo: 5,
        description: "Surrounded by vineyards, this stay is perfect for peaceful retreats.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc100005"),
        type: "farmhouse",
        location: {
            state: "Maharashtra",
            city: "Nashik",
            pincode: "422003",
            latitude: "19.9975",
            longitude: "73.7898"
        },
        price: {
            base: "7000",
            guest: "800",
            pet: "350"
        },
        occupancy: {
            guest: 8,
            bed: 4,
            pet: 2,
            bath: 2,
            bedRoom: 4
        },
        amenities: ["Farm View", "Organic Meals", "Bonfire"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "farmhouse1.jpg",
                remotePath: "room-images/farmhouse1.jpg",
                remoteId: "room-images/farmhouse1",
                mimetype: "image/jpeg",
                size: 51000
            }
        ]
    },
    {
        title: "Colonial Guesthouse in Pondicherry",
        roomNo: 6,
        description: "Heritage guesthouse with colorful interiors and walkable beach access.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc100006"),
        type: "guesthouse",
        location: {
            state: "Puducherry",
            city: "Pondicherry",
            pincode: "605001",
            latitude: "11.9360",
            longitude: "79.8334"
        },
        price: {
            base: "2700",
            guest: "300",
            pet: "100"
        },
        occupancy: {
            guest: 3,
            bed: 2,
            pet: 1,
            bath: 1,
            bedRoom: 1
        },
        amenities: ["WiFi", "Garden", "Breakfast"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "guesthouse1.jpg",
                remotePath: "room-images/guesthouse1.jpg",
                remoteId: "room-images/guesthouse1",
                mimetype: "image/jpeg",
                size: 36500
            }
        ]
    },
    {
        title: "Hilltop Cottage in Shimla",
        roomNo: 7,
        description: "Wooden cottage with a valley view, perfect for a romantic getaway.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc100007"),
        type: "cottage",
        location: {
            state: "Himachal Pradesh",
            city: "Shimla",
            pincode: "171001",
            latitude: "31.1048",
            longitude: "77.1734"
        },
        price: {
            base: "3000",
            guest: "400",
            pet: "200"
        },
        occupancy: {
            guest: 4,
            bed: 2,
            pet: 1,
            bath: 1,
            bedRoom: 2
        },
        amenities: ["Mountain View", "Fireplace", "Balcony"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "cottage1.jpg",
                remotePath: "room-images/cottage1.jpg",
                remoteId: "room-images/cottage1",
                mimetype: "image/jpeg",
                size: 42100
            }
        ]
    },
    {
        title: "Compact Studio in Koregaon Park",
        roomNo: 8,
        description: "Minimalist studio with everything you need in one space.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc100008"),
        type: "studio",
        location: {
            state: "Maharashtra",
            city: "Pune",
            pincode: "411001",
            latitude: "18.5362",
            longitude: "73.8930"
        },
        price: {
            base: "1800",
            guest: "200",
            pet: "150"
        },
        occupancy: {
            guest: 2,
            bed: 1,
            pet: 1,
            bath: 1,
            bedRoom: 1
        },
        amenities: ["WiFi", "Compact Kitchen", "Air Conditioning"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "studio1.jpg",
                remotePath: "room-images/studio1.jpg",
                remoteId: "room-images/studio1",
                mimetype: "image/jpeg",
                size: 29500
            }
        ]
    },
    {
        title: "Bungalow Retreat near Ooty Lake",
        roomNo: 9,
        description: "Standalone bungalow with garden, patio and full privacy.",
        hostId: mongoose.Types.ObjectId("64d98c5e5bce0f3abc100009"),
        type: "bungalow",
        location: {
            state: "Tamil Nadu",
            city: "Ooty",
            pincode: "643001",
            latitude: "11.4064",
            longitude: "76.6932"
        },
        price: {
            base: "4000",
            guest: "500",
            pet: "300"
        },
        occupancy: {
            guest: 6,
            bed: 3,
            pet: 2,
            bath: 2,
            bedRoom: 3
        },
        amenities: ["Lawn", "Kitchen", "Pet Friendly", "Fireplace"],
        status: "ACTIVE",
        attachments: [
            {
                originalFileName: "bungalow1.jpg",
                remotePath: "room-images/bungalow1.jpg",
                remoteId: "room-images/bungalow1",
                mimetype: "image/jpeg",
                size: 55000
            }
        ]
    }
];

console.log(dummyRooms.length);
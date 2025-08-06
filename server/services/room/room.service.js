const RoomDao = require("../../dao/room.dao");
const { toaster } = require("../../utilities/messages/toaster.messages");
const FileSystemService = require("../file-system/file-system.service");


class RoomService {


    #buildRoom = (hostId, data, attachments) => {

        const state = JSON.parse(data.state);
        const city = JSON.parse(data.city);
        const amenities = JSON.parse(data.amenities);
        const occupancy = JSON.parse(data.occupancy);
        const price = JSON.parse(data.price);

        return {
            title: data.title,
            roomNo: data.roomNo,
            description: data.description,
            hostId: hostId,
            location: {
                state: state.value,
                city: city.value,
                pincode: data.pincode,
                latitude: data.latitude,
                longitude: data.longitude
            },
            price: {
                base: price.base,
                guest: price.guest,
                pet: price.pet
            },
            occupancy: {
                guest: occupancy.guest,
                bed: occupancy.bed,
                bath: occupancy.bath,
                bedRoom: occupancy.bedRoom,
                pet: occupancy.pet
            },
            amenities: amenities && amenities.length ? amenities.map(item => item.value) : [],
            attachments
        }
    }

    create = async (hostId, data, files) => {
        try {

            const fileSystemService = new FileSystemService();

            const attachments = await fileSystemService.privateUpload(files, 'room-images');
            const roomDao = await RoomDao.init();

            const room = await this.#buildRoom(hostId, data, attachments);
            return await roomDao.create(room);

        } catch (error) {
            throw error;
        }
    }

    roomList = async (hostId, params) => {
        try {

            const roomDao = await RoomDao.init();

            const list = await roomDao.myRoomsList(hostId, params);
            const length = await roomDao.myRoomsListCount(hostId, params);

            return { list, length };
        } catch (error) {
            throw error;
        }
    }


    updateStatus = async (roomId, status) => {
        try {
            const roomDao = await RoomDao.init();
            await roomDao.updateById(roomId, { $set: { status: status } });

            let message = '';

            switch (status) {
                case 'ACTIVE':
                    message = toaster.ROOM_ACTIVE
                    break;
                case 'MAINTENANCE':
                    message = toaster.ROOM_MAINTENANCE
                    break;
                case 'DELETE':
                    message = toaster.ROOM_DELETED
                    break;

            }

            return message;
        } catch (error) {
            throw error;
        }
    }

    getRoomDetails = async (roomId) => {

        try {

            const roomDao = await RoomDao.init();
            const roomDetails = await roomDao.getRoomDetails(roomId);

            return roomDetails[0];
        } catch (error) {
            throw error;
        }

    }

    #filterRemoveAttachments = async (attachments, publicIds) => {

        if (publicIds.length == 0) {
            return {
                attachmentToKeep: attachments,
                attachmentToRemove: [],
            }
        }

        const attachmentToRemove = [];
        const attachmentToKeep = [];
        for (const att of attachments) {
            if (publicIds.includes(att.remoteId)) {
                attachmentToRemove.push(att);
            } else {
                attachmentToKeep.push(att);
            }
        }

        return { attachmentToRemove, attachmentToKeep };
    }


    update = async (hostId, roomId, data, files) => {
        try {

            const removeAttachments = data.removeAttachments ? JSON.parse(data.removeAttachments) : [];

            const fileSystemService = new FileSystemService();
            const roomDao = await RoomDao.init();
            const room = await roomDao.findById(roomId);

            const { attachmentToKeep, attachmentToRemove } = await this.#filterRemoveAttachments(room.attachments, removeAttachments);
            if (attachmentToRemove.length) {
                console.log("DS: ", attachmentToRemove);
                await fileSystemService.deleteFiles(attachmentToRemove);
            }

            const attachments = await fileSystemService.privateUpload(files, 'room-images');
            const updatedRoom = await this.#buildRoom(hostId, data, [...attachmentToKeep, ...attachments]);

            return await roomDao.updateById(roomId, { $set: { ...updatedRoom } });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = RoomService;
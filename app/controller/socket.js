async function connect(sck) {
    function sckJoin(...roomIds) {
        return new Promise(resolve => {
            sck.join(roomIds, () => {
                roomIds.forEach(r => rooms.add(r));
                console.debug('Joined rooms=%j, all=%j', roomIds, Array.from(rooms));
                resolve();
            });
        });
    }

    function sckLeave(...roomIds) {
        return new Promise(resolve => {
            sck.leave(roomIds, () => {
                roomIds.forEach(r => rooms.delete(r));
                console.debug('Leaved rooms=%j, all=%j', roomIds, Array.from(rooms));
                resolve();
            });
        });
    }

    async function subscribe({room_id}) {
        console.log(`subscribe ${room_id}`)
        await sckJoin(room_id);
    }

    async function unsubscribe({room_id}) {
        console.log(`unsubscribe ${room_id}`)
        await sckLeave(room_id);
    }

    console.log("Connected", sck.id)
    sck.on('subscribe', subscribe);
    sck.on('unsubscribe', unsubscribe);
}

module.exports = {
    connect
};

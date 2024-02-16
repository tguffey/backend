var count = 0;
module.exports = (socket, count) => {
    socket.on('counter', async () => {
        count++;
        console.log(count);
        socket.emit('counter', count);
    });
};
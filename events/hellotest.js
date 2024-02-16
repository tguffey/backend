
module.exports = (socket) => {
    socket.on('hellotest', async () => {
        console.log("test received")
        socket.emit('hellotest', 'Hello World!');
    })

}
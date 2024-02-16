module.exports = (socket) => {
    socket.on('hello', async () => {
        console.log("hello event received")
        // Assuming you want to send a response back to the client
        socket.emit('hello', 'Hello from the server!');
    })

}
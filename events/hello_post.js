// hello_post.js

module.exports = (socket) => {
    socket.on('hello_post', async (data) => {
        console.log("hello_post event received with data:", data)
        // Assuming you want to send a response back to the client
        socket.emit('hello_post', 'Post request received!');
    })
}
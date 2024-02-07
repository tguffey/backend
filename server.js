const express = require('express'); //requires express module
const socket = require('socket.io'); //requires socket.io module
const db = require('./database'); // for MySQL db commands
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT); //tells to host server on localhost:3000


//Playing variables:
app.use(express.static('public')); //show static files in 'public' directory
console.log('Server is running');
const io = socket(server);

var count = 0;


//Socket.io Connection------------------
io.on('connection', (socket) => {

    console.log("New socket connection: " + socket.id)

    socket.on('counter', () => {
        count++;
        console.log(count)
        socket.emit('counter', count);
    })


    socket.on('hellotest', () => {
        console.log("test received")
        socket.emit('hellotest', 'Hello World!');
    })

    // Hello GET function
    socket.on('hello', () => {
        console.log("hello event received")
        // Assuming you want to send a response back to the client
        socket.emit('hello', 'Hello from the server!');
    })

    // HelloPost POST function
    socket.on('hello_post', (data) => {
        console.log("hello_post event received with data:", data)
        // Assuming you want to send a response back to the client
        socket.emit('hello_post', 'Post request received!');
    })

    // Handle 'sql_query' event
    socket.on('sql_query', async () => {
        try {
            const [rows, fields] = await db.promise().query("SELECT * FROM users");
            console.log(rows);
            // Emit the fetched data back to the client
            socket.emit('sql_result', rows);
        } catch (err) {
            console.error(err.message, "sql_query");
            // Emit an error back to the client
            socket.emit('sql_result', { error: 'Internal Server Error' });
        }
    })
})
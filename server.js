const express = require('express'); //requires express module
const socket = require('socket.io'); //requires socket.io module
const db = require('./database'); // for MySQL db commands
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT); //tells to host server on localhost:3000
var testConnect = require('./TestConnection');

// //____________________________________________________


//Playing variables:
app.use(express.static('public')); //show static files in 'public' directory
console.log('Server is running');
const io = socket(server);
var count = 0;

// Test database connection
testConnect.testConnect();
testConnect.testRetrieve();


//Socket.io Connection------------------
io.on('connection', (socket) => {

    console.log("New socket connection: " + socket.id)

    socket.on('counter', async () => {
        count++;
        console.log(count)
        socket.emit('counter', count);
    })

    socket.on('hellotest', async () => {
        console.log("test received")
        socket.emit('hellotest', 'Hello World!');
    })

    // Hello GET function
    socket.on('hello', async () => {
        console.log("hello event received")
        // Assuming you want to send a response back to the client
        socket.emit('hello', 'Hello from the server!');
    })

    // HelloPost POST function
    socket.on('hello_post', async (data) => {
      console.log("hello_post event received with data:", data)
      // Assuming you want to send a response back to the client
      socket.emit('hello_post', 'Post request received!');
    })

    socket.on('save_signup_info', async (username, email, password) => {
      try {      
        // TODO: Sanitize all fields (no sql injection)
        // TODO: store password as hash for data security
        // TODO: when fail, emit fail event, when sucess, emit sucess event for the front end to handle differntly.
        // NOTE: MySql wants different " or ' for the SQL commands
        connection.query('INSERT INTO testgrocer.users (username,email,password) values ' + `("${username}","${email}","${password}")`);
        //emit success msg heere
        socket.emit('save_signup_sucess', "sign up sucessful!")
        } catch (err) {
            console.error(err.message, "save_signup_info");
            // Emit an error back to the client
            socket.emit('save_signup_result', { error: 'Internal Server Error' });
        }
    })

    // Handle 'sql_query' event
    socket.on('sql_query', async () => {
        try {
            const [rows, fields] = await db.promise().query("SELECT username,email FROM users");
            console.log("here are the users: ", rows);
            // Emit the fetched data back to the client
            // socket.emit('hello_post', 'Post these are the users');
            socket.emit('sql_result', rows);
        } catch (err) {
            console.error(err.message, "sql_query");
            // Emit an error back to the client
            socket.emit('sql_result', { error: 'Internal Server Error' });
        }
    })
})






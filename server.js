const express = require('express'); //requires express module
const socket = require('socket.io'); //requires socket.io module
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT); //tells to host server on localhost:3000
var testConnect = require('./TestConnection');

const mysql = require('mysql2');
const db = require('./database'); // for MySQL db commands
const connection = mysql.createConnection(db)
// //____________________________________________________


//Playing variables:
app.use(express.static('public')); //show static files in 'public' directory
console.log('Server is running');
const io = socket(server);
var count = 0;

// Test database connection using 
testConnect.testConnect();
testConnect.testRetrieve();


//Socket.io Connection------------------
io.on('connection', (socket) => {
    // receiving events and emit back.
    console.log("New socket connection: " + socket.id)

    require('./events/counter')(socket, count); // counter button
    require('./events/hellotest')(socket); //
    require('./events/gettest')(socket); // Get test button
    require('./events/hello_post')(socket); // post test button in the app
    require('./events/save_signup_info')(socket,connection); // SIGN UP button in the app
    require('./events/sql_query')(socket,connection); // Handle 'sql_query' event
    
})






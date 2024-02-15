const express = require('express'); //requires express module
const socket = require('socket.io'); //requires socket.io module
const db = require('./database'); // for MySQL db commands
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT); //tells to host server on localhost:3000
const mysql = require('mysql2');




//___________testing database connection___________________________________________________
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '24$+vY!#Fjk-3',
    database: 'testgrocer'
  });

// Connect to the database
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });


//testing database operations
const inputData = {
    username: 'example_user0',
    email: 'user098@example.com',
    password: 'rand0mP4ss'
};

// // insert object into database
// connection.query('INSERT INTO testgrocer.users SET ?', inputData, (err, results) => {
//     if (err) {
//       console.error('Error inserting data into MySQL database:', err);
//       return;
//     }
//     console.log('Data inserted successfully:', results);
//   });

//retrieve information and format
connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error querying MySQL database:', err);
      return;
    }

    // Display user information in the terminal
    console.log('User Information:');
    results.forEach((user) => {
      console.log(`Username: ${user.username}, Email: ${user.email}`);
    })
});

// Handle errors
connection.on('error', (err) => {
    console.error('MySQL database error:', err);
  });
  
// Close the database connection when the Node.js process exits
process.on('exit', () => {
    connection.end();
  });

// //____________________________________________________


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






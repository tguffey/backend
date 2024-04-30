// const express = require('express'); //requires express module
// const socket = require('socket.io'); //requires socket.io module
// const fs = require('fs');
// const app = express();
// var PORT = process.env.PORT || 3000;
// const server = app.listen(PORT); //tells to host server on localhost:3000
// var testConnect = require('./TestConnection');

// const mysql = require('mysql2');
// const db = require('./database'); // for MySQL db commands
// const connection = mysql.createConnection(db)
// //____________________________________________________

// Register_email_check
// receives: "register_email_check
// emits back: 
//      "email_check_error"
//      "email_check_success"
//      "email_check_error" of catch block
// problem is here. the front end does not receive the event for some reason. 

module.exports = (socket,connection) => {
    socket.on('register_email_check', async (email) => {
        try{
            const query = 'SELECT * FROM users WHERE email = ?';
            connection.query(query, [email], (err, results) => {
                // this emit works!
                socket.emit('testing_emits', 'emitting from register_email_check')


                // if (err){
                //     console.error('Error querying database: ' + err.stack);
                //     socket.emit('email_check_error', 'Internal server error, try again later');
                //     socket.emit('hitest', "hi");
                //     return;
                // }
                
                // if a user is found with that mail aready, emit 
                if (results.length !== 0){
                    console.log("email" + email + " has already been used.");
                    socket.emit('email_check_duplicate_detected', 'An account with this email already exists.');
                    socket.emit('hitest', "hi");
                    return;
                } // making sure the result is blank
                else if (results.length === 0){
                    console.log("email" + email + " is unique. user can proceed to next step.");
                    socket.emit('email_check_success', 'email is unique and valid');
                    // the front end was able to recieve this next emit
                    // socket.emit('hitest', "hi");
                    return;
                }
                console.log("if statements has concluded, if it doesnt print one of two results, something is wrong.");
                

                // if a user with such name already exist, meaning sucessful query
            })
        }catch(error){
            console.log("database error in catch block");
            socket.emit('email_check_error', 'error in database');
            socket.emit('hitest', "hi");
        }

    })
}
// // log_in event
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

const bcrypt = require('bcrypt')

// //____________________________________________________

module.exports = (socket,connection) => {

    // maybe replace with async(email, password)
    socket.on('log_in', async(username,password) => {
        
        console.log("log in event received");
        const values = [username, password];


        console.log("now querying the databse to find user:" + username);
        // Query the database to check if user with the provided email exists
        try{
            const query = 'SELECT * FROM users WHERE username = ?';
            connection.query(query, [username], async (err, results) => {
                
                // unknown error, maybe database, terminate process
                if (err){
                    console.error('Error querying database: ' + err.stack);
                    socket.emit('loginError', 'Internal Server error. try again later.')
                    return;
                }
    
                // If no user is found with such username, emit "fail_noUserExist"
                // absolute operand to make sure no automatic type conversions take place
                // terminate process
                if (results.length === 0){
                    console.log("cannot find the user with this username.");
                    socket.emit('fail_noUserExist', 'There is no user with that username, please try again.')
                    return;
                }
                
                // this works, assign the query result to user. from that we can retrieve other fields of user.
                console.log("now assigning the results to user.");
                const user = results[0];
                
                try{
                    const passwordMatch = await bcrypt.compare(password, user.password); // returns a bool im assuming
                    
                    // if passowrds match,log and emit success event
                    if (passwordMatch) {
                        console.log("was able to find and authenticate the user. now emitting back");
                        console.log("User authenticated successfully.");
                        socket.emit('success_login', "Login Successful. Welcome back!");
                    } else {
                        console.log("was able to find the uuser but password is incorrect.");
                        socket.emit('fail_wrongPassword', 'Incorrect password.');
                    }

                }catch(error){
                    console.error('Error comparing passwords:', error);
                    socket.emit('loginError', 'Internal Server error. Try again later.');
                }
            });
        
        } catch(error){
            console.error('Error querying database:', error);
            socket.emit('loginError', 'Internal Server error. Try again later.');
        }
        


    });
}
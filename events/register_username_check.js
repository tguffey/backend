module.exports = (socket,connection) => {
    socket.on('register_username_check', async (username) => {
        try{
            const query = 'SELECT * FROM users WHERE username = ?';
            connection.query(query, [username], (err, results) => {
                // this emit works!
                socket.emit('testing_emits', 'emitting from register_username_check')


                // if (err){
                //     console.error('Error querying database: ' + err.stack);
                //     socket.emit('username_check_error', 'Internal server error, try again later');
                //     socket.emit('hitest', "hi");
                //     return;
                // }
                
                // if a user is found with that mail aready, emit 
                if (results.length !== 0){
                    console.log("username" + username + " has already been used.");
                    socket.emit('username_check_duplicate_detected', 'An account with this username already exists.');
                    socket.emit('hitest', "hi");
                    return;
                } // making sure the result is blank
                else if (results.length === 0){
                    console.log("username" + username + " is unique. user can proceed to next step.");
                    socket.emit('username_check_success', 'username is unique and valid');
                    // the front end was able to recieve this next emit
                    // socket.emit('hitest', "hi");
                    return;
                }
                console.log("if statements has concluded, if it doesnt print one of two results, something is wrong.");
                

                // if a user with such name already exist, meaning sucessful query
            })
        }catch(error){
            console.log("database error in catch block");
            socket.emit('username_check_error', 'error in database');
            socket.emit('hitest', "hi");
        }

    })
}
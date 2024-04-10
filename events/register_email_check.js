module.exports = (socket,connection) => {
    socket.on('register_email_check', async (email) => {
        try{
            const query = 'SELECT * FROM users WHERE email = ?';
            connection.query(query, [email], (err, results) => {

                if (err){
                    console.error('Error querying database: ' + err.stack);
                    socket.emit('email_check_error', 'Internal server error, try again later')
                    return;
                }
                
                // if a user is found with that mail aready, emit 
                if (results.length !== 0){
                    socket.emit("email_check_duplicate_detected", "An account with this email already exists.")
                    return;
                } else if (results.length === 0){
                    socket.emit("email_check_sucess", "email is unique and valid")
                    return;
                }


                // if a user with such name already exist, meaning sucessful query
            })
        }catch(error){
            console.log("database error")
            socket.emit('email_check-error', 'error in database')
        }

    })
}
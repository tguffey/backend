// log_in event


module.exports = (socket,connection) => {

    // maybe replace with async(email, password)
    socket.on('login_attempt', (data) => {
        const { email, password } = data ;


        // Query the database to check if user with the provided email exists
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], (err, results) => {
            
            // unknown error, maybe database, terminate process
            if (err){
                console.error('Error querying database: ' + err.stack);
                socket.emit('loginError', 'Internal Server error. try again later.')
                return;
            }


            // If no user is found with such email, emit "fail_noUserExist"
            // absolute operand to make sure no automatic type conversions take place
            if (results.length === 0){
                socket.emit('fail_noUserExist', 'There is no user with that email, please try again.')
                return;
            }
            
            // TODO: not sure if this works, test it out please.
            const user = results[0]

            // check if password matches. if not emit fail_wrongPassword
            // absolute operand to make sure no automatic type conversions take place
            if (user.password !== password){
                socket.emit('fail_wrongPassword', 'Incorrect password.')
                return;
            }

            // if password matches, emit success_login
            socket.emit('success_login', "Login Sucessful, welcome back!")
            

        });


    });
}
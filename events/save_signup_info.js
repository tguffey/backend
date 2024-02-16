//save_signup_info.js

module.exports = (socket,connection) => {
    socket.on('save_signup_info', async (username, email, password) => {
        try {      
            // TODO: Sanitize all fields (no sql injection)
            // TODO: store password as hash for data security
            // TODO: when fail, emit fail event, when sucess, emit sucess event for the front end to handle differntly.
            // NOTE: MySql wants different " or ' for the SQL commands
            connection.query('INSERT INTO testgrocer.users (username,email,password) values ' + `("${username}","${email}","${password}")`);
            //emit success msg heere
            socket.emit('save_signup_result', "sign up sucessful!")
            } catch (err) {
                console.error(err.message, "save_signup_info");
                // Emit an error back to the client
                socket.emit('save_signup_result', { error: 'Internal Server Error' });
            }
    })
}
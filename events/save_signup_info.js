//save_signup_info.js
// NOTE: MySql wants different " or ' for the SQL commands
// connection.query('INSERT INTO testgrocer.users (username,email,password) values ' + `("${username}","${email}","${password}")`);

// DONE: sanitize query to prevent sql injection
// DONE: handling error on back end, duplicate insert error
// DONE: handling emit back messge after fail or success on front end
// TODO LATER: store password as hash for data security

module.exports = (socket,connection) => {
    socket.on('save_signup_info', async (username, email, password) => {
        const query = 'INSERT INTO testgrocer.users (username,email,password) values (? , ? , ?)';
        const values =[username, email, password]; //sanitized       
        connection.query(query, values,(error, results, fields) => {
            // handling duplicate mail error
            if(error){
                if (error.code === 'ER_DUP_ENTRY') {
                    // Duplicate entry error, duplicate email
                    console.error('An account with this email already exists. please choose a differnt email.');
                    // Emit an error event to the client
                    socket.emit('registrationError', 'An account with this email already exists. please choose a differnt email.');
                  } else {
                    // Other types of errors
                    console.error(error);
                    // Handle other errors as needed
                    socket.emit('registrationError', 'Internal Server Error');
                  }
            }else{
                // Query was successful
                console.log('Inserted successfully!');
                // Emit a success event to the client
                socket.emit('save_signup_result', 'sign up sucessful!');
            }
        });
        
        
        
        // try {      
        //     // TODO LATER: store password as hash for data security
        //     // TODO: when fail, emit fail event, when sucess, emit sucess event for the front end to handle differntly.
        //     // connection.query('INSERT INTO testgrocer.users (username,email,password) values ' + `("${username}","${email}","${password}")`);
        //     const query = 'INSERT INTO testgrocer.users (username,email,password) values (? , ? , ?)';
        //     const values =[username, email, password]; //sanitized
        //     connection.query(query, values);
        //     //emit success msg heere
        //     socket.emit('save_signup_result', "sign up sucessful!")
        // } catch (err) {
        //         console.error(err.message, "save_signup_info");
        //         // Emit an error back to the client
        //         socket.emit('save_signup_result', { error: 'Internal Server Error' });
        // }
    })
}
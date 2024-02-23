// sql_query.js

module.exports = (socket,connection) => {
    socket.on('sql_query', async () => {
        try {
            const [rows, fields] = await connection.promise().query("SELECT username,email FROM users");
            console.log("here are the users: ", rows);
            // Emit the fetched data back to the client
            // socket.emit('hello_post', 'Post these are the users');
            const jsonRows = rows.map(row => ({ username: row.username, email: row.email }));

            socket.emit('sql_result', jsonRows);
        } catch (err) {
            console.error(err.message, "sql_query");
            // Emit an error back to the client
            socket.emit('sql_result', { error: 'Internal Server Error' });
        }
    })
}
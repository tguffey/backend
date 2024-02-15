const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '24$+vY!#Fjk-3',
    database: 'testgrocer'
})

// Handle errors
connection.on('error', (err) => {
    console.error('MySQL database error:', err);
})

module.exports = {

    //___________testing database connection___________________________________________________
    testConnect: function () {
        // Connect to the database
        connection.connect((err) => {
            if (err) {
            console.error('Error connecting to MySQL database:', err);
            return;
            }
            console.log('Connected to MySQL database');
        })

        // Close the database connection when the Node.js process exits
        process.on('exit', () => {
            connection.end();
        })
    },

    testRetrieve: function () {
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
        })

        // Close the database connection when the Node.js process exits
        process.on('exit', () => {
            connection.end();
        })
    },  
};
    
 //testing database operations

// TEST INSERT
// const inputData = {
//   username: 'example_user0',
//   email: 'user098@example.com',
//   password: 'rand0mP4ss'
// };
// // insert object into database
// connection.query('INSERT INTO testgrocer.users SET ?', inputData, (err, results) => {
//     if (err) {
//       console.error('Error inserting data into MySQL database:', err);
//       return;
//     }
//     console.log('Data inserted successfully:', results);
//   });
   

   

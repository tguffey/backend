// Function to get all recipes along with their items using existing connection
async function getAllRecipes(connection) {
    try {
        const [recipes] = await connection.promise().query(`
            SELECT r.recipe_id, r.name AS recipe_name, r.link, 
                   i.name AS item_name, i.unit, i.amount
            FROM recipes AS r
            JOIN recipes_items AS ri ON r.recipe_id = ri.recipe_id
            JOIN items AS i ON ri.item_id = i.item_id
        `);
        return recipes;
    } catch (error) {
        console.error('Failed to retrieve recipes:', error);
        throw error;
    }
}

module.exports = (socket, connection) => {
    socket.on('get-server-recipes', async () => {
        try {
            console.log('Fetching all recipes...');
            const recipes = await getAllRecipes(connection);
            socket.emit('server-recipes-result', recipes);
            console.log('All recipes have been sent.');
        } catch (error) {
            console.error(`Error fetching recipes: ${error}`);
            socket.emit('error', error.message);
        }
    });
};
const mysql = require('mysql2');

async function addRecipe(connection, recipeName, link, items) {
    try {
        // Start a transaction
        await connection.promise().beginTransaction();

        // Insert the new recipe into the recipes table
        const [recipeResult] = await connection.promise().query(
            `INSERT INTO recipes (name, link) VALUES (?, ?)`,
            [recipeName, link]
        );

        const recipeId = recipeResult.insertId;
        console.log(`Inserted recipe with ID: ${recipeId}`);

        // Insert the items into the items table and create entries in the recipes_items table
        for (const item of items) {
            const [itemResult] = await connection.promise().query(
                `INSERT INTO items (name, unit, amount) VALUES (?, ?, ?)`,
                [item.name, item.unit, item.amount]
            );

            const itemId = itemResult.insertId;
            console.log(`Inserted item with ID: ${itemId}`);

            await connection.promise().query(
                `INSERT INTO recipes_items (recipe_id, item_id) VALUES (?, ?)`,
                [recipeId, itemId]
            );
        }

        // Commit the transaction
        await connection.promise().commit();

        return { success: true, message: 'Recipe added successfully' };
    } catch (error) {
        // Rollback the transaction in case of an error
        await connection.promise().rollback();
        console.error('Failed to add recipe:', error);
        throw error;
    }
}

module.exports = (socket, connection) => {
    socket.on('add-recipe', async (recipeName, link, items) => {
        try {
            console.log(`Received add-recipe event: ${recipeName}, ${link}, ${items}`);
            
            // Parse the items string to a JSON array
            const itemsArray = JSON.parse(items);

            const result = await addRecipe(connection, recipeName, link, itemsArray);
            socket.emit('add-recipe-result', result);
            console.log('Recipe has been added.');
        } catch (error) {
            console.error(`Error adding recipe: ${error}`);
            socket.emit('error', error.message);
        }
    });
};

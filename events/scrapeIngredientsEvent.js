const { scrapeIngredients } = require('./ingredient_scraper');

module.exports = (socket) => {
    socket.on('get-ingredients', async (url) => {
        try {
            console.log(`Scraping ingredients from: ${url}`);
            const ingredients = await scrapeIngredients(url); // Make sure to implement this function
            socket.emit('ingredients-result', ingredients);
            console.log(`Finished scraping from: ${url}`);
            console.log(`Data sent: ${JSON.stringify(ingredients, null, 2)}`);
        } catch (error) {
            console.error(`Error scraping ingredients: ${error}`);
            socket.emit('ingredients-error', error.message);
        }
    });
};
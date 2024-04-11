// Adjusting scrapeIngredientsEvent.js to handle both ingredients and instructions
const { scrapeIngredientsAndInstructions } = require('./ingredient_scraper');

module.exports = (socket) => {
    socket.on('get-ingredients', async (url) => {
        try {
            console.log(`Scraping recipe data from: ${url}`);
            const { ingredients, instructions } = await scrapeIngredientsAndInstructions(url);
            socket.emit('ingredients-result', { ingredients, instructions });
            console.log(`Finished scraping from: ${url}`);
        } catch (error) {
            console.error(`Error scraping recipe data: ${error}`);
            socket.emit('ingredients-result', error.message);
        }
    });
};

module.exports = (socket) => {
    socket.on('get-ingredients-for-shopping-list', async (url) => {
        try {
            console.log(`(SL) Scraping recipe data from: ${url}`);
            const { ingredients, instructions } = await scrapeIngredientsAndInstructions(url);
            socket.emit('ingredients-result-for-shopping-list', { ingredients});
            console.log(`(SL) Finished scraping from: ${url}`);
        } catch (error) {
            console.error(`(SL) Error scraping recipe data: ${error}`);
            socket.emit('ingredients-result', error.message);
        }
    });
};
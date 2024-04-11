const { scrapeIngredientsAndInstructions } = require('./ingredient_scraper');
const { getNutritionalContent } = require('./nutritional_data_tool');

module.exports = (socket) => {
    socket.on('get-ingredients-for-nutritional-data', async (url) => {
        try {
            console.log(`Starting recipe -> Nutritional Data function:`);
            console.log(`Scraping recipe ingredients from: ${url}`);
            const { ingredients, instructions } = await scrapeIngredientsAndInstructions(url);
            console.log(`Finished scraping ingredients from: ${url}`);
            console.log('Ingredients list:');
            const nutritionalDataResults = [];

            for (const ingredient of ingredients) {
                console.log(`Amount: ${ingredient.Amount}, Unit: ${ingredient.Unit}, Name: ${ingredient.Name}`);
                // Fetch nutritional data for each ingredient
                const nutritionalInfo = await getNutritionalContent(ingredient.Name, ingredient.Amount, ingredient.Unit);
                if (!nutritionalInfo.error) {
                    console.log(`Nutritional Information for ${ingredient.Name}:`);
                    console.log(`- Description: ${nutritionalInfo.description}`);
                    console.log(`- MyPlate Category: ${nutritionalInfo.myPlateCategory}`);
                    Object.entries(nutritionalInfo.nutrients).forEach(([nutrient, value]) => {
                        console.log(`- ${nutrient}: ${value}`);
                    });
                    nutritionalDataResults.push(nutritionalInfo);
                } else {
                    console.log(nutritionalInfo.error);
                    nutritionalDataResults.push({
                        Name: ingredient.Name,
                        Error: nutritionalInfo.error
                    });
                }
            }

            // Emit the results for all ingredients once all nutritional data has been fetched
            socket.emit('ingredients-result-for-nutritional-data', nutritionalDataResults);
            console.log(`Finished processing and emitted nutritional data for ingredients from: ${url}`);

        } catch (error) {
            console.error(`Error fetching ingredients to nutritional data: ${error}`);
            socket.emit('ingredients-result-for-nutritional-data', { error: error.message });
        }
    });
};
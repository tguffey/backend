const { scrapeIngredientsAndInstructions } = require('./ingredient_scraper');
const { getNutritionalContent } = require('./nutritional_data_tool');

module.exports = (socket) => {
    socket.on('get-ingredients-for-nutritional-data', async (url) => {
        try {
            console.log(`Starting recipe -> Nutritional Data function:`);
            console.log(`Scraping recipe ingredients from: ${url}`);
            const { ingredients } = await scrapeIngredientsAndInstructions(url);
            console.log(`Finished scraping ingredients from: ${url}`);

            // Prepare promises for fetching nutritional data for each ingredient
            const nutritionalDataPromises = ingredients.map(ingredient => {
                return getNutritionalContent(ingredient.Name, ingredient.Amount, ingredient.Unit)
                    .then(nutritionalInfo => {
                        if (!nutritionalInfo.error) {
                            console.log(`Nutritional Information for ${ingredient.Name}:`);
                            console.log(`- Description: ${nutritionalInfo.description}`);
                            console.log(`- MyPlate Category: ${nutritionalInfo.myPlateCategory}`);
                            console.log(`Nutrients:`);
                            const nutrients = {};
                            Object.entries(nutritionalInfo.nutrients).forEach(([nutrient, value]) => {
                                console.log(`- ${nutrient}: ${value}`);
                                nutrients[nutrient] = value;
                            });
                            return {
                                Name: ingredient.Name,
                                Description: nutritionalInfo.description,
                                MyPlateCategory: nutritionalInfo.myPlateCategory,
                                Nutrients: nutrients
                            };
                        } else {
                            console.log(`Error for ${ingredient.Name}: ${nutritionalInfo.error}`);
                            return {
                                Name: ingredient.Name,
                                Error: nutritionalInfo.error
                            };
                        }
                    })
                    .catch(error => {
                        console.error(`Failed to fetch nutritional data for ${ingredient.Name}: ${error}`);
                        return {
                            Name: ingredient.Name,
                            Error: 'Failed to fetch nutritional data'
                        };
                    });
            });

            // Execute all promises concurrently
            const nutritionalDataResults = await Promise.all(nutritionalDataPromises);
            console.log(`Finished processing nutritional data for all ingredients from: ${url}`);

            // Emit the results once all nutritional data has been fetched
            socket.emit('ingredients-result-for-nutritional-data', nutritionalDataResults);

        } catch (error) {
            console.error(`Error fetching ingredients to nutritional data: ${error}`);
            socket.emit('ingredients-result-for-nutritional-data', { error: error.message });
        }
    });
};

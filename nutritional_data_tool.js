// Import the 'node-fetch' module and define a fetch function that uses it
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const apiKey = 'dvEk2AbG3YMJO0FddHDUebVnviEvjSBVxzqV1bqB';

// Function to get nutritional data for a given food by name
async function getNutritionalData(foodName) {
    // Construct the URL for the API request 
    // Encode foodName to ensure it's a valid URL component
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodName)}&api_key=${apiKey}`;
    
    try {
        // Wait for the fetch to complete then store the response
        const response = await fetch(url);
        
        // Parse the JSON body of the response to get the actual data
        const data = await response.json();

        // Checks if there are any foods in the response and at least one result returned
        if (data.foods && data.foods.length > 0) {
            // Takes the first food item from the results as the desired one
            const foodData = data.foods[0];
            
            // Logs the description of the food and a message about data reporting
            console.log(`Food: ${foodData.description}`);
            console.log(`Data reported per 100 grams or as specified.`);
            
            // Filters the nutrients for the food item to only include specific nutrients and logs them
            const nutrients = foodData.foodNutrients.filter(n => ['Protein', 'Total lipid (fat)', 'Carbohydrate, by difference', 'Energy'].includes(n.nutrientName));
            nutrients.forEach(nutrient => {
                console.log(`${nutrient.nutrientName}: ${nutrient.value} ${nutrient.unitName}`);
            });
        } else {
            // Logs a message if no data is found for the provided food name
            console.log(`No data found for ${foodName}.`);
        }
    } catch (error) {
        // Catches and logs any error that occurs during the fetch operation
        console.error(`Error fetching nutritional data for ${foodName}:`, error);
    }
}

// Example function calls to get nutritional data for different food items
getNutritionalData('chicken');
getNutritionalData('cheddar cheese');
getNutritionalData('butter');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const apiKey = 'dvEk2AbG3YMJO0FddHDUebVnviEvjSBVxzqV1bqB';

async function getNutritionalData(foodName) {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodName)}&api_key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.foods && data.foods.length > 0) {
            const foodData = data.foods[0]; // Assuming the first result is the desired one
            console.log(`Food: ${foodData.description}`);
            console.log(`Data reported per 100 grams or as specified.`);
            const nutrients = foodData.foodNutrients.filter(n => ['Protein', 'Total lipid (fat)', 'Carbohydrate, by difference', 'Energy'].includes(n.nutrientName));
            nutrients.forEach(nutrient => {
                console.log(`${nutrient.nutrientName}: ${nutrient.value} ${nutrient.unitName}`);
            });
        } else {
            console.log(`No data found for ${foodName}.`);
        }
    } catch (error) {
        console.error(`Error fetching nutritional data for ${foodName}:`, error);
    }
}

// Example test cases
getNutritionalData('chicken');
getNutritionalData('cheddar cheese');
getNutritionalData('butter');

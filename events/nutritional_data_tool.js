// Import the 'node-fetch' module and define a fetch function that uses it
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const apiKey = 'dvEk2AbG3YMJO0FddHDUebVnviEvjSBVxzqV1bqB';

// Function to convert various units to grams (for solids) or milliliters (for liquids)
function convertToGrams(quantity, unit) {
    const conversionFactors = {
        cup: 240,
        tsp: 4.92892,
        teaspoon: 4.92892,
        tablespoon: 14.7868,
        tbsp: 14.7868,
        pound: 453.592,
        lb: 453.592,
        ounce: 28.3495,
        oz: 28.3495,
        g: 1,
        gram: 1,
        kilogram: 1000,
        kg: 1000,
        ml: 1,
        liter: 1000,
        l: 1000
    };
    return quantity * (conversionFactors[unit] || 0);
}

// Helper function to categorize food into MyPlate categories based on keywords
function categorizeMyPlate(foodDescription) {
    const description = foodDescription.toLowerCase();
    const categoryKeywords = {
        meat: ['chicken', 'beef', 'pork', 'turkey', 'meat', 'fish', 'seafood'],
        dairy: ['milk', 'cheese', 'yogurt', 'dairy'],
        vegetables: ['vegetable', 'lettuce', 'carrot', 'pea', 'potato', 'onion', 'kale', 'spinach'],
        grains: ['grain', 'wheat', 'rice', 'oat', 'barley', 'corn', 'bread', 'pasta'],
        fruits: ['fruit', 'apple', 'banana', 'orange', 'berry', 'grape', 'peach', 'pear']
    };
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => description.includes(keyword))) {
            return category;
        }
    }
    return 'unknown';
}

// Function to get nutritional data for a given food by name, quantity, and unit, and prints desired nutritional values
async function getNutritionalContent(foodName, quantity, unit) {
    const quantityInGrams = convertToGrams(quantity, unit);
    if (quantityInGrams === 0) {
        console.error(`Unsupported unit: ${unit}.`);
        return;
    }
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodName)}&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.foods && data.foods.length > 0) {
            const foodData = data.foods[0];
            console.log(`Food: ${foodData.description}`);
            // Determine and display the MyPlate category
            const myPlateCategory = categorizeMyPlate(foodData.description);
            console.log(`MyPlate Category: ${myPlateCategory.charAt(0).toUpperCase() + myPlateCategory.slice(1)}`);

            const nutrientNames = {
                Protein: 'Protein',
                Carbs: 'Carbohydrate, by difference',
                Fat: 'Total lipid (fat)'
            };
            Object.entries(nutrientNames).forEach(([key, nutrientName]) => {
                const nutrient = foodData.foodNutrients.find(n => n.nutrientName === nutrientName);
                if (nutrient) {
                    const totalNutrient = (nutrient.value * quantityInGrams) / 100;
                    console.log(`${key}: ${totalNutrient.toFixed(2)} ${nutrient.unitName}`);
                } else {
                    console.log(`${key} content not found for ${foodName}.`);
                }
            });
        } else {
            console.log(`No data found for ${foodName}.`);
        }
    } catch (error) {
        console.error(`Error fetching nutritional data for ${foodName}:`, error);
    }
}

module.exports = {
    getNutritionalContent
};

// Example usage
//getNutritionalContent('chicken', 1, 'pound');
//getNutritionalContent('cheddar cheese', 2, 'oz');
//getNutritionalContent('apple yogurt', 2, 'oz');
//getNutritionalData('butter');

// Unit Conversion for pounds
// 1 pound / 0.0022046 = ~453.6 grams
// So, 1 pound of chicken = (USDA protein amount) * (453.6/100 grams) = total protein



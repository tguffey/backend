const axios = require('axios');
const cheerio = require('cheerio');

// This function converts single digit fraction characters to numerical format
function convertFractions(input) {
    const fractionMappings = {
        '½': '1/2',
        '⅓': '1/3',
        '⅔': '2/3',
        '¼': '1/4',
        '¾': '3/4',
        '⅕': '1/5',
        '⅖': '2/5',
        '⅗': '3/5',
        '⅘': '4/5',
        '⅙': '1/6',
        '⅚': '5/6',
        '⅛': '1/8',
        '⅜': '3/8',
        '⅝': '5/8',
        '⅞': '7/8',
    };

    return input.replace(new RegExp(Object.keys(fractionMappings).join('|'), 'g'), matched => fractionMappings[matched]);
}

// This function parses the ingredient text to extract and format the amount, unit, and name
function parseIngredient(ingredient) {
    ingredient = convertFractions(ingredient);
    ingredient = ingredient.replace(/\(\$[^\)]+\)/, '').trim();

    // Enhanced regex to more accurately differentiate between units and the beginning of ingredient names
    const regex = /^(?:▢\s*)?([0-9\/\-\s]+)?\s*(cup|tsp|teaspoon|tablespoon|tbsp|pound|lb|ounce|oz|g|gram|kilogram|kg|ml|liter|l)?(?:\s+\(([^)]+)\))?\s*(.*)/i;
    let match = ingredient.match(regex);

    if (match) {
        let [, amount, unit, additionalDetails, name] = match;
        name = name ? name.trim() : '';

        // Remove any leading dot and spaces from the name
        name = name.replace(/^\.\s*/, '');

        // This logic is specifically to address the issue with "2 large eggs" where "l"
        // is cut off and assumed the name for "unit", since l is also "liters"
        // Implement a logic to check if 'unit' is actually part of 'name'
        if (unit === 'l' && /^[aeiou]/i.test(name)) {
            // This assumes 'l' followed by a vowel at the start of 'name' is likely not a unit
            name = `l${name}`; // Prepend 'l' back to the start of 'name'
            unit = ''; // Clear the 'unit' as it's been determined to be part of the name
        } else {
            unit = unit ? unit.trim() : '';
        }

        if (additionalDetails) {
            name = `${additionalDetails} ${name}`; // Prepend additional details to name if present
        }

        return {
            Amount: amount ? amount.trim() : '',
            Unit: unit,
            Name: name
        };
    }
    return { Amount: '', Unit: '', Name: ingredient };
}

async function scrapeIngredientsAndInstructions(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        let ingredients = [];
        let instructions = [];
        let recipeName = [];

        // Scrape Recipe Name
        // May need to adjust selector based on actual HTML structure of the website
        recipeNameString = $('.wprm-recipe-name').first().text().trim();
        recipeName.push(recipeNameString); 
        
        // Scrape Ingredients
        $('.wprm-recipe-ingredient').each((index, element) => {
            const fullText = $(element).text().trim();
            const parsedIngredient = parseIngredient(fullText);
            ingredients.push(parsedIngredient);
        });

        // Scrape Instructions
        // Adjust the selector based on the website's structure for instructions
        $('.wprm-recipe-instruction-text').each((index, element) => {
            const stepText = $(element).text().trim();
            instructions.push(stepText); // Collecting instructions as an array of strings
        });

        // Show the scraped data in log
        console.log(recipeName);
        //console.log(ingredients);
        //console.log('Instructions:', instructions);

        return { recipeName, ingredients, instructions }; // Return recipeName, ingredients and instructions
    } catch (error) {
        console.error(`Error scraping recipe data: ${error}`);
        throw error; // Rethrow the error to be caught by the caller
    }
}

module.exports = {
    scrapeIngredientsAndInstructions // Updated to reflect the new function name and functionality
};

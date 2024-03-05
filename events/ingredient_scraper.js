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

    const regex = /^(?:▢\s*)?([0-9\/\-\s]+)?\s*(cup|tsp|teaspoon|tablespoon|tbsp|pound|lb|ounce|oz|g|gram|kilogram|kg|ml|liter|l)?(?:\s*\(([^)]+)\))?\s*([^,]+),?/i;
    const match = ingredient.match(regex);

    if (match) {
        let [, amount, unit, additionalDetails, name] = match;
        unit = unit ? unit.trim() : '';
        if (additionalDetails) {
            unit += ` (${additionalDetails.trim()})`;
        }
        return {
            Amount: amount ? amount.trim() : '',
            Unit: unit,
            Name: name ? name.trim() : ''
        };
    }
    return { Amount: '', Unit: '', Name: ingredient };
}

// This function scrapes ingredients from a given URL
async function scrapeIngredients(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        let ingredients = [];

        // This selector should be adjusted based on the specific structure of the website you are scraping
        $('.wprm-recipe-ingredient').each((index, element) => {
            const fullText = $(element).text().trim();
            const parsedIngredient = parseIngredient(fullText);
            ingredients.push(parsedIngredient);
        });

        return ingredients;
    } catch (error) {
        console.error(`Error scraping ingredients: ${error}`);
        throw error; // Rethrow the error to be caught by the caller
    }
}

module.exports = {
    scrapeIngredients
};

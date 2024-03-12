const { getNutritionalContent } = require('./nutritional_data_tool');

module.exports = (socket) => {
    socket.on('get-nutritional-data', async (foodName, quantity, unit) => {
        try {
            console.log(`Grabbing Nutritional Data for Food: ${foodName},
            Quantity: ${quantity}, and Unit: ${unit}`);
            // Food data being grabbed
            const foodData = await getNutritionalContent(foodName, quantity, unit);
            socket.emit(`nutritional-data-result`, foodData);
            console.log(`Finished grabbing Nutritional Data on: ${foodName}`);
            console.log(`Data sent: ${JSON.stringify(foodData, null, 2)}`);

        } catch (error) {
            console.error(`Error grabbing Nutritional Data: ${error}`);
            socket.emit('API connection error', error.message);
        }
    });
};
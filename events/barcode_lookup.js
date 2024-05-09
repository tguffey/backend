// Import the node-fetch library to make HTTP requests
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = (socket) => {
    // Listen for the 'getProductInfo' event
    socket.on('get-barcode-info', async (barcode) => {
        // If no barcode is provided, emit an 'error' event with a message
        if (!barcode) {
            socket.emit('error', 'Please enter a barcode.');
            return;
        }

        // Construct the URL for the Open Food Facts API using the barcode
        const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
        try {
            // Make a fetch request to the URL
            const response = await fetch(url);
            // Convert the response to JSON
            const data = await response.json();

            // If the product is found (status is 1), emit the product name
            if (data.status === 1) {
                const product = data.product;
                const productName = product.product_name;
                socket.emit('productInfo', productName);
            } else {
                // If the product is not found, emit an 'error' event with a message
                socket.emit('error', "Product not found. Please try a different barcode.");
            }
        } catch (error) {
            // If an error occurs during the fetch request, log the error and emit an 'error' event with a message
            console.error("Failed to retrieve product info:", error);
            socket.emit('error', "An error occurred while fetching product information.");
        }
    });
};
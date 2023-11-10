const fs = require('fs')
const path = require('path');

async function deleteImageFromProductsFolder(rootDirectory, product) {
    try {
        const imagePath = product.image_url;
        const parsedUrl = new URL(imagePath);
        const absolutePath = path.join(rootDirectory, parsedUrl.pathname);
        await fs.promises.unlink(absolutePath);
    } catch (error) {
        throw new Error('Error deleting image');
    }
}

module.exports = { deleteImageFromProductsFolder }
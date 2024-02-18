const fs = require('fs')
const path = require('path');
async function deleteImageFromBrandFolder(rootDirectory, product) {
    try {
        if (!product || !product.image_url) {
            console.error('Brand Image is null or undefined. Cannot delete image.');
            return; // No need to proceed if image_url is missing or null
        }
        const imagePath = product.image_url;
        const parsedUrl = new URL(imagePath);
        const absolutePath = path.join(rootDirectory, parsedUrl.pathname);

        // Check if the file exists before attempting to delete
        const fileExists = await fs.promises.access(absolutePath)
            .then(() => true)
            .catch(() => false);

        if (fileExists) {
            await fs.promises.unlink(absolutePath);
        } else {
            console.warn('File does not exist. Skipping deletion.');
        }
    } catch (error) {
        throw new Error('Error deleting image');
    }
}

// async function deleteImageFromBrandFolder(rootDirectory, product) {
//     try {
//         if (!product) {
//             console.error('Brand Image is null or undefined. Cannot delete image.');
//         }
//         const imagePath = product.image_url;
//         const parsedUrl = new URL(imagePath);
//         const absolutePath = path.join(rootDirectory, parsedUrl.pathname);
//         await fs.promises.unlink(absolutePath);
//     } catch (error) {
//         throw new Error('Error deleting image');
//     }
// }

module.exports = { deleteImageFromBrandFolder }



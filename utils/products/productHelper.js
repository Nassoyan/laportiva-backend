const fs = require('fs');
const path = require('path');

// async function deleteImageFromProductsFolder(rootDirectory, product) {
//     try {
//         console.log(product, "mtaAAV");
//         const imagePath = product.image_url;
//         const parsedUrl = new URL(imagePath);
//         const decodedPathname = decodeURIComponent(parsedUrl.pathname); // Decode URL-encoded pathname
//         const absolutePath = path.join(rootDirectory, decodedPathname);

//         // Check if the file exists before attempting to delete
//         const fileExists = await fs.promises.access(absolutePath).then(() => true).catch(() => false);
//         if (fileExists) {
//             await fs.promises.unlink(absolutePath);
//             console.log(`File deleted: ${absolutePath}`);
//         } else {
//             console.error(`File not found: ${absolutePath}`);
//         }
//     } catch (error) {
//         throw new Error('Error deleting image');
//     }
// }

// module.exports = { deleteImageFromProductsFolder };


async function deleteImageFromProductsFolder(rootDirectory, product) {
    try {
        if (!product) {
              console.error('Product is null or undefined. Cannot delete image.');
          }
        console.log(product,"-> product-Image");
        const imagePath = product.image_url;
        const parsedUrl = new URL(imagePath);
        const decodedPathname = decodeURIComponent(parsedUrl.pathname); // Decode URL-encoded pathname
        const absolutePath = path.join(rootDirectory, decodedPathname);
        await fs.promises.unlink(absolutePath);
    } catch (error) {
        throw new Error('Error deleting image');
    }
}

module.exports = { deleteImageFromProductsFolder };


// const fs = require('fs');
// const path = require('path');

// async function deleteImageFromProductsFolder(rootDirectory, product) {
//     try {
//         if (!product) {
//             console.error('Product is null or undefined. Cannot delete image.');
//             return;
//         }
//         console.log("mtav");
//         const imagePath = product.image_url;
//         const parsedUrl = new URL(imagePath);
//         const decodedPathname = decodeURIComponent(parsedUrl.pathname); // Decode URL-encoded pathname
//         const absolutePath = path.join(rootDirectory, decodedPathname);

//         console.log(absolutePath, "-> absolutePath in deleteImageFromProductsFolder function");

//         // Check if the file exists before attempting to delete
//         const fileExists = await fs.promises.access(absolutePath).then(() => true).catch(() => false);
//         console.log(fileExists, "-> fileExists in deleteImageFromProductsFolder function");


//         if (fileExists) {
//             await fs.promises.unlink(absolutePath);
//             console.log(`File deleted: ${absolutePath}`);
//         } else {
//             console.error(`File not found: ${absolutePath}`);
//         }
//     } catch (error) {
//         console.error('Error deleting image:', error);
//     }
// }

// module.exports = { deleteImageFromProductsFolder };


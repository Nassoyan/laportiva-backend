const fs = require('fs');
const path = require('path');

// async function deleteImageFromProductsFolder(rootDirectory, product) {
//     try {
//         if (!product) {
//               console.error('Product is null or undefined. Cannot delete image.');
//           }
//         console.log(product,"-> product-Images type");
//         if(typeof product === 'object') {
//                 const imagePath = product.image_url;
//                 const parsedUrl = new URL(imagePath);
//                 const decodedPathname = decodeURIComponent(parsedUrl.pathname); // Decode URL-encoded pathname
//                 const absolutePath = path.join(rootDirectory, decodedPathname);
//                 await fs.promises.unlink(absolutePath);
//         } else {
//             for (const singleProduct of product) {
//                 console.log("mtav for of");
//                 const imagePath = singleProduct.dataValues.image_url;
//                 const parsedUrl = new URL(imagePath);
//                 const decodedPathname = decodeURIComponent(parsedUrl.pathname); // Decode URL-encoded pathname
//                 const absolutePath = path.join(rootDirectory, decodedPathname);
//                 await fs.promises.unlink(absolutePath);
//             }
//         }
//     } catch (error) {
//         throw new Error('Error deleting image');
//     }
// }

async function deleteImageFromProductsFolder(rootDirectory, product) {
    try {
        if (!product) {
            console.error('Product is null or undefined. Cannot delete image.');
        }

        console.log(product, "-> product-Images type");

        if (Array.isArray(product)) {
            for (const singleProduct of product) {
                console.log("mtav for of");
                const imagePath = singleProduct.dataValues.image_url;
                const parsedUrl = new URL(imagePath);
                const decodedPathname = decodeURIComponent(parsedUrl.pathname);
                const absolutePath = path.join(rootDirectory, decodedPathname);
                await fs.promises.unlink(absolutePath);
            }
        } else if (typeof product === 'object') {
            // If it's a single object, not an array
            const imagePath = product.image_url;
            const parsedUrl = new URL(imagePath);
            const decodedPathname = decodeURIComponent(parsedUrl.pathname);
            const absolutePath = path.join(rootDirectory, decodedPathname);
            await fs.promises.unlink(absolutePath);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Error deleting image');
    }
}


module.exports = { deleteImageFromProductsFolder };


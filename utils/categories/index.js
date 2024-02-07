const { sequelize } = require('../../bin/config/database');
const { QueryTypes } = require('sequelize');

async function getChildCategory (id) {
    const data = await sequelize.query(`select distinct categories.* from category_relations
    inner join categories on categories.id = category_relations.category_id
    where category_relations.parent_category_id = ${id}`, { type: QueryTypes.SELECT });

    return data;
}


async function processCategoriesData(data) {
    if (!data.length) return [];

    await Promise.all(data.map(async (item) => {
        item.children = await getChildCategory(item.id);
        await processCategoriesData(item.children);
    }));

    return data;
}




module.exports = {
    getChildCategory,
    processCategoriesData
}
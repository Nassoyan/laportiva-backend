const obj = {
          id: "1",
          name: "Keramika",
          child: {
                 id: "2",
                 name: "bajak",
                 child: { 
                     id: "3", 
                     name: "gini", 
                     child: {
                          name: "karmir", 
                          id: "4" 
                        }
                     }
             }
        } 


let currentItem = null;

for(let item of obj) {
    console.log(item);
    let parentId = currentItem;
    let name = item.name;
    let id = item.id;
    let childCategoryId = item.child ? item.child.id : null;

    console.info(`Database to be inserted: 
      category_id -> ${id},
      parent_category_id -> ${parentId},
      child_category_id -> ${childCategoryId}`)

    currentItem = item.id;
}

function processNestedObject(obj, parentId) {
   
    if (!obj || !obj.hasOwnProperty('child')) {
        console.info(`Database to be inserted: 
                            category_id -> ${obj.id},
                            parent_category_id -> ${parentId},
                            child_category_id -> null`)
        return;
    }

    // Process the current object
    console.info(`Database to be inserted: 
    category_id -> ${obj.id},
    parent_category_id -> ${parentId},
    child_category_id -> ${obj.child.id}`)

    // Recursive case: process the child object
    processNestedObject(obj.child, obj.id);
}
const { db } = require('../config/firebaseServer');

const productCollection = db.collection('products');

const findAll = async () => {
    const snapshot = await productCollection.get();
    const products = [];
    snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
    });
    return products;
};



const create = async (productData) => {
    const docRef = await productCollection.add(productData);
    return docRef.id;
};


module.exports = { findAll, create};
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

const findById = async (id) => {
    const doc = await productCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const create = async (productData) => {
    const docRef = await productCollection.add(productData);
    return docRef.id;
};

const remove = async (id) => {
    await productCollection.doc(id).delete();
};

module.exports = { findAll, findById, create, remove };
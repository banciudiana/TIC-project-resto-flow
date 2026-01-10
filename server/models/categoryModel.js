const { db } = require('../config/firebaseServer');
const categoryCollection = db.collection('categories');

const findAll = async () => {
    const snapshot = await categoryCollection.get();
    const categories = [];
    snapshot.forEach(doc => {
        categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
};

const create = async (name) => {
    const newCategory = {
        name: name,
        createdAt: new Date().toISOString()
    };
    const docRef = await categoryCollection.add(newCategory);
    return docRef.id;
};

module.exports = { findAll, create };
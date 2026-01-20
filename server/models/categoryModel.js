const { db } = require('../config/firebaseServer');
const categoriesCollection = db.collection('categories');

const findAll = async () => {
    const snapshot = await categoriesCollection.get();
    const categories = [];
    snapshot.forEach(doc => {
        categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
};

const findById = async (id) => {
    const doc = await categoriesCollection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

const create = async (categoryData) => {
    console.log("DB Object:", db);
    const docRef = await categoriesCollection.add(categoryData);
    return docRef.id;
};

const update = async (id, updateData) => {
    const docRef = categoriesCollection.doc(id);
    await docRef.update(updateData);
    return { id, ...updateData };
};

const remove = async (id) => {
    await categoriesCollection.doc(id).delete();
};



const findByName = async (name) => {
  
    const snapshot = await categoriesCollection
        .where('name', '==', name)
        .get();

    return !snapshot.empty;
};

module.exports = { findAll, findById, create, update, remove, findByName };

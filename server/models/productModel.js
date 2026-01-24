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
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

const create = async (productData) => {
 
    const docRef = await productCollection.add({
        ...productData,
        createdAt: new Date().toISOString()
    });
    return docRef.id;
};

const update = async (id, updateData) => {
    const productRef = productCollection.doc(id);
    
    const cleanData = JSON.parse(JSON.stringify(updateData)); 

    await productRef.update({
        ...cleanData,
        updatedAt: new Date().toISOString()
    });

    const updatedDoc = await productRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
};

const remove = async (id) => {
    await productCollection.doc(id).delete();
};


const assignCategory = async (productId, categoryObject) => {
    const productRef = productCollection.doc(productId);
    await productRef.update({
        category: categoryObject, 
        updatedAt: new Date().toISOString()
    });
    return { productId, category: categoryObject };
};


const findByName = async (name) => {
    const snapshot = await productCollection
        .where('name', '==', name)
        .get();
    
    if (snapshot.empty) return null;
    
    
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

module.exports = { 
    findAll, 
    findById, 
    create, 
    update, 
    remove, 
    assignCategory,
    findByName
};
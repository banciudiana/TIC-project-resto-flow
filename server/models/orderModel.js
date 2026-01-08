const { db } = require('../config/firebaseServer');
const orderCollection = db.collection('orders');

const findAll = async () => {
    const snapshot = await orderCollection.get();
    const orders = [];
    snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
};

const create = async (orderData) => {
   
    const newOrder = {
        tableNumber: orderData.tableNumber,
        waiterId: orderData.waiterId,
        items: [],
        totalAmount: 0,
        notes: "",
        status: 'pending',
        chefId: null,
        createdAt: new Date().toISOString()
    };
    
    const docRef = await orderCollection.add(newOrder);
    return docRef.id;
};

module.exports = { findAll, create };
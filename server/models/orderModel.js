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

const findById = async (id) => {
    const doc = await orderCollection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

const create = async (orderData) => {
    const newOrder = {
        tableNumber: orderData.tableNumber,
        waiterId: orderData.waiterId, 
        items: [],
        totalAmount: 0,
        notes: orderData.notes || "",
        status: 'PENDING', 
        chefId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const docRef = await orderCollection.add(newOrder);
    return docRef.id;
};

const updateStatus = async (orderId, status, extraFields = {}) => {
    const orderRef = orderCollection.doc(orderId);
    await orderRef.update({
        status,
        ...extraFields,
        updatedAt: new Date().toISOString()
    });
    return { id: orderId, status };
};


const addProductToOrder = async (orderId, product) => {
    const orderRef = orderCollection.doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) throw new Error('Order not found');
    
    const orderData = orderDoc.data();
    const updatedItems = [...orderData.items, product];
    const newTotal = orderData.totalAmount + product.price;

    await orderRef.update({
        items: updatedItems,
        totalAmount: newTotal,
        updatedAt: new Date().toISOString()
    });

    return { id: orderId, totalAmount: newTotal, items: updatedItems };
};

const removeProductFromOrder = async (orderId, productIndex) => {
    const orderRef = orderCollection.doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) throw new Error('Order not found');
    
    const orderData = orderDoc.data();

    const currentTotal = Number(orderData.totalAmount) || 0;
    const items = orderData.items || [];

    const updatedItems = [...orderData.items];
    updatedItems.splice(productIndex, 1);
    
    const newTotal = updatedItems.reduce((acc, item) => {
        return acc + (Number(item.price) || 0);
    }, 0);



    await orderRef.update({
        items: updatedItems,
        totalAmount: newTotal, 
        updatedAt: new Date().toISOString()
    });

    return { id: orderId, totalAmount: newTotal, items: updatedItems };
};

const remove = async (id) => {
    await orderCollection.doc(id).delete();
};

module.exports = { 
    findAll, 
    findById, 
    create, 
    updateStatus, 
    addProductToOrder, 
    remove,
    removeProductFromOrder
};
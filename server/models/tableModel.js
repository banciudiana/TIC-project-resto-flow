const { db } = require('../config/firebaseServer');
const tableRef = db.collection('settings').doc('restaurant_config');

const getConfig = async () => {
    const doc = await tableRef.get();
    return doc.exists ? doc.data() : { totalTables: 0 };
};



const updateConfig = async (count) => {
    await tableRef.set({
        totalTables: parseInt(count),
        updatedAt: new Date().toISOString()
    }, { merge: true });
    
    
    return { totalTables: count };
};

module.exports = { getConfig, updateConfig };
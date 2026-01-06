const { db, admin } = require('../config/firebaseServer');

const dbService = {
  
  async getCollection(collectionName) {
    try {
      const snapshot = await db.collection(collectionName).get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error fetching collection ${collectionName}:`, error);
      throw error;
    }
  },


  async getDocument(collectionName, docId) {
    try {
      const doc = await db.collection(collectionName).doc(docId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(`Error fetching document from ${collectionName}:`, error);
      throw error;
    }
  },

  async addDocument(collectionName, data) {
    try {
      const docRef = await db.collection(collectionName).add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      

      const doc = await docRef.get();
      return {
        id: docRef.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  },

 
  async updateDocument(collectionName, docId, data) {
    try {
      await db.collection(collectionName).doc(docId).update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
     
      const doc = await db.collection(collectionName).doc(docId).get();
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  },

 
  async deleteDocument(collectionName, docId) {
    try {
      await db.collection(collectionName).doc(docId).delete();
      return { id: docId, deleted: true };
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  },

  
  async queryCollection(collectionName, filters = []) {
    try {
      let query = db.collection(collectionName);

 
      filters.forEach(filter => {
        query = query.where(filter.field, filter.operator, filter.value);
      });
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error querying collection ${collectionName}:`, error);
      throw error;
    }
  }
};

module.exports = dbService;
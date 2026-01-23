const { comparePassword } = require('../utils/auth');
const { db } = require('../config/firebaseServer');

const usersCollection = db.collection('users')

const findByEmail = async (email) => {

    
        const snapshot = await usersCollection
            .where('email', '==', email)
            .get();

        if (snapshot.empty) {
            return null
        }

        const userDoc = snapshot.docs[0];
        const user = {
            id: userDoc.id,
            ...userDoc.data()
        };

        return user
}

const verifyPassword = async (plainPassword, hashedPassword) => {
    return await comparePassword(plainPassword, hashedPassword)
}

const checkEmailExists = async (email) => {
    const snapshot = await usersCollection
        .where('email', '==', email)
        .get();

    return !snapshot.empty;
}

const create = async (userData) => {
    const docRef = await usersCollection.add(userData);
    return docRef.id;
}


const getStaff = async () => {
    const snapshot = await usersCollection
        .where('role', 'in', ['ROLE_WAITER', 'ROLE_CHEF'])
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
const deleteUser = async (id) => {
    await usersCollection.doc(id).delete();
    return true;
};


const updateUser = async (id, data) => {
    const docRef = usersCollection.doc(id);
    await docRef.update(data);
    return { id, ...data };
};



module.exports = {
    findByEmail,
    verifyPassword,
    checkEmailExists,
    create,
    getStaff,
    deleteUser,
    updateUser
}
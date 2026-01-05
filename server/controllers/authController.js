const { db } = require('../config/firebaseServer');


exports.registerUser = async (req, res) => {
  try {
    const { uid, email, name, role } = req.body;
    
   
    const validRoles = ['waiter', 'chef', 'patron'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Ivalid role" });
    }

    const userProfile = {
      uid,
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    };

    await db.collection('users').doc(uid).set(userProfile);
    res.status(201).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "Error for creating user profile: " + error.message });
  }
};

//Get acc data
exports.getUserProfile = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found " });
    }
    
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: "Error fetching user data: " + error.message });
  }
};
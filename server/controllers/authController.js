const dbService = require('../services/dbService'); 

exports.registerUser = async (req, res) => {
  try {
    const { uid, email, name, role } = req.body;
    
    const validRoles = ['waiter', 'chef', 'patron'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const userProfile = {
      uid,
      email,
      name,
      role
    };

   
    const { db } = require('../config/firebaseServer');
    await db.collection('users').doc(uid).set({
      ...userProfile,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "Error for creating user profile: " + error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    
    const user = await dbService.getDocument('users', req.params.uid);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user data: " + error.message });
  }
};
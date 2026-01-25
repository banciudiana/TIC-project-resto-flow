const { validationResult } = require('express-validator')
const { findByEmail, verifyPassword, checkEmailExists, create } = require('../models/userModel.js')
const { generateToken, hashPassword } = require('../utils/auth');
const { auth } = require('../config/firebaseServer');

const login = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ error: validationErrors.array() })
    }
    
    try {
        const { email, password } = req.body;
        const user = await findByEmail(email)

        if(!user || !(await verifyPassword(password, user.password))) {
            return res.status(401).json({ error: "Invalid login" })
        }

        
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role 
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role 
            }
        });

    } catch(error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
}

const register = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ error: validationErrors.array() });
    }

    try {
        const { email, password, role } = req.body;

        if (!req.user || req.user.role !== 'ROLE_OWNER') {
            return res.status(403).json({ 
                error: 'Acces denied. Only owners can create new user accounts.' 
            });
        }

        
        const userExists = await checkEmailExists(email);
        if (userExists) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: role
        });

        const hashedPassword = await hashPassword(password);
        
        const newUser = {
            email,
            password: hashedPassword,
            role: role, // ROLE_WAITER, ROLE_CHEF 
            createdAt: new Date().toISOString()
        };

        const userId = await create(newUser);

        res.status(201).json({
            message: `Account for ${role} created successfully.`,
            user: { id: userId, email, role }
        });
    } catch(error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error creating account.' });
    }
};




const registerOwner = async (req, res) => {
    try {
        const { email, password, secretKey } = req.body;

   
        if (secretKey !== process.env.JWT_SECRET) {
            return res.status(403).json({ error: 'Key is incorrect.' });
        }

        const userExists = await checkEmailExists(email);
        if (userExists) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        const userRecord = await auth.createUser({
            email: email,
            password: password,
        });

        const hashedPassword = await hashPassword(password);

        const newOwner = {
            email,
            password: hashedPassword,
            role: 'ROLE_OWNER', 
            createdAt: new Date().toISOString()
        };

        const userId = await create(newOwner);

        res.status(201).json({
            message: 'Owner created successfully!',
            user: { id: userId, email, role: 'ROLE_OWNER' }
        });
    } catch (error) {
        console.error('Owner registration error:', error);
        res.status(500).json({ error: 'Error creating Owner.' });
    }
};


module.exports = { login, register, registerOwner };
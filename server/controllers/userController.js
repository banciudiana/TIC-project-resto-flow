const userModel = require('../models/userModel');

const getStaffMembers = async (req, res) => {
    try {
        const staff = await userModel.getStaff();
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch staff members' });
    }
};

const removeEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await userModel.deleteUser(id);
        res.status(200).json({ message: 'Employee removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const result = await userModel.updateUser(id, updatedData);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
};

module.exports = {
    getStaffMembers,
    removeEmployee,
    updateEmployee
};
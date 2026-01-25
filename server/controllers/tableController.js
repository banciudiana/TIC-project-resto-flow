const tableModel = require('../models/tableModel');

const getTableConfig = async (req, res) => {
    try {
        const config = await tableModel.getConfig();
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTableConfig = async (req, res) => {
    try {
        const { totalTables } = req.body;
        if (totalTables === undefined || totalTables < 0) {
            return res.status(400).json({ error: 'Invalid number of tables' });
        }

        const result = await tableModel.updateConfig(totalTables);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getTableConfig, updateTableConfig };
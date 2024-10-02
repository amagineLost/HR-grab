const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Roblox API URL (for group members with a specific rank)
const getGroupMembersUrl = (groupId, rankId, limit = 100) => {
    return `https://groups.roblox.com/v1/groups/${groupId}/roles/${rankId}/users?limit=${limit}`;
};

// Middleware to handle CORS (Roblox requires CORS to make HTTP requests to external servers)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Function to handle errors
const handleError = (res, error) => {
    console.error('Error fetching data:', error.response ? error.response.status : error.message);
    res.status(500).json({ error: 'Failed to fetch group members', details: error.message });
};

// Endpoint to fetch group members with a specific rank
app.get('/group/:groupId/rank/:rankId', async (req, res) => {
    const { groupId, rankId } = req.params;
    console.log(`Fetching members for Group ID: ${groupId}, Rank ID: ${rankId}`);

    try {
        const response = await axios.get(getGroupMembersUrl(groupId, rankId));
        res.json(response.data);
    } catch (error) {
        handleError(res, error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

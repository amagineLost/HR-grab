const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Roblox API URL (for group members with a specific rank)
const getGroupMembersUrl = (groupId, rankId, limit = 100) => {
    return `https://groups.roblox.com/v1/groups/${groupId}/roles/${rankId}/users?limit=${limit}`;
};

// Middleware to handle CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Adding Axios retry interceptor for automatic retries on failure
const axiosRetry = require('axios-retry');
axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 1000; // wait 1 second between retries
}});

// Enhanced error handling for easier debugging
const handleError = (res, error) => {
    console.error('Error fetching data:', error.message || error);
    res.status(500).json({ error: 'Failed to fetch group members', details: error.message || error });
};

// Endpoint to fetch group members with a specific rank
app.get('/group/:groupId/rank/:rankId', async (req, res) => {
    const { groupId, rankId } = req.params;

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

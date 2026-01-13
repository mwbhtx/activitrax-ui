import axios from "axios";

const API_URL = process.env.REACT_APP_ACTIVITRAX_API_URL + "/feedback";

/**
 * Get feedback topics
 * @param {string} api_token - Auth0 access token
 * @param {Object} filters - { category, status }
 * @param {Object} pagination - { page, limit, sort }
 * @returns {Promise<Object>} { topics, total, page, pages }
 */
export const getTopics = async (api_token, filters = {}, pagination = {}) => {
    const params = {
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        ...filters
    };

    if (pagination.sort) {
        params.sort = pagination.sort;
    }

    const reqConfig = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + api_token
        },
        url: API_URL + "/topics",
        params
    };

    const response = await axios(reqConfig);
    return response.data;
};

/**
 * Create a new feedback topic
 * @param {string} api_token - Auth0 access token
 * @param {Object} topicData - { title, description, category }
 * @returns {Promise<Object>} Created topic
 */
export const createTopic = async (api_token, topicData) => {
    const reqConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: API_URL + "/topics",
        data: topicData
    };

    const response = await axios(reqConfig);
    return response.data;
};

/**
 * Get a single topic with its replies
 * @param {string} api_token - Auth0 access token
 * @param {string} topic_id - Topic's MongoDB ObjectId
 * @returns {Promise<Object>} { topic, replies }
 */
export const getTopicDetail = async (api_token, topic_id) => {
    const reqConfig = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + api_token
        },
        url: `${API_URL}/topics/${topic_id}`
    };

    const response = await axios(reqConfig);
    return response.data;
};

/**
 * Update topic status (admin only)
 * @param {string} api_token - Auth0 access token
 * @param {string} topic_id - Topic's MongoDB ObjectId
 * @param {string} status - 'Open' or 'Closed'
 * @returns {Promise<Object>}
 */
export const updateTopicStatus = async (api_token, topic_id, status) => {
    const reqConfig = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: `${API_URL}/topics/${topic_id}/status`,
        data: { status }
    };

    const response = await axios(reqConfig);
    return response.data;
};

/**
 * Delete a topic (admin only)
 * @param {string} api_token - Auth0 access token
 * @param {string} topic_id - Topic's MongoDB ObjectId
 * @returns {Promise<Object>}
 */
export const deleteTopic = async (api_token, topic_id) => {
    const reqConfig = {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + api_token
        },
        url: `${API_URL}/topics/${topic_id}`
    };

    const response = await axios(reqConfig);
    return response.data;
};

/**
 * Create a reply to a topic
 * @param {string} api_token - Auth0 access token
 * @param {string} topic_id - Topic's MongoDB ObjectId
 * @param {string} content - Reply content
 * @returns {Promise<Object>} Created reply
 */
export const createReply = async (api_token, topic_id, content) => {
    const reqConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: `${API_URL}/topics/${topic_id}/replies`,
        data: { content }
    };

    const response = await axios(reqConfig);
    return response.data;
};

/**
 * Delete a reply (admin only)
 * @param {string} api_token - Auth0 access token
 * @param {string} reply_id - Reply's MongoDB ObjectId
 * @returns {Promise<Object>}
 */
export const deleteReply = async (api_token, reply_id) => {
    const reqConfig = {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + api_token
        },
        url: `${API_URL}/replies/${reply_id}`
    };

    const response = await axios(reqConfig);
    return response.data;
};

/**
 * Get count of unread feedback topics
 * @param {string} api_token - Auth0 access token
 * @returns {Promise<number>} Count of unread topics
 */
export const getUnreadCount = async (api_token) => {
    const reqConfig = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + api_token
        },
        url: `${API_URL}/unread-count`
    };

    const response = await axios(reqConfig);
    return response.data.count;
};

/**
 * Mark a topic as read
 * @param {string} api_token - Auth0 access token
 * @param {string} topic_id - Topic's MongoDB ObjectId
 * @returns {Promise<Object>}
 */
export const markTopicAsRead = async (api_token, topic_id) => {
    const reqConfig = {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + api_token
        },
        url: `${API_URL}/topics/${topic_id}/mark-read`
    };

    const response = await axios(reqConfig);
    return response.data;
};

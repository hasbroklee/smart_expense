/**
 * AI Service
 * Service to call Python FastAPI for expense classification
 */

const axios = require('axios');

const AI_API_URL = process.env.AI_API_URL || 'http://localhost:8000';

class AIService {
    /**
     * Classify an expense using the AI service
     * @param {string} description - Expense description
     * @param {string} userId - User ID
     * @param {number} amount - Optional amount (will be extracted if not provided)
     * @returns {Promise<Object>} Classification result
     */
    static async classifyExpense(description, userId, amount = null) {
        try {
            const response = await axios.post(`${AI_API_URL}/classify-expense`, {
                description,
                userId,
                amount
            }, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: {
                        predictedCategory: response.data.predictedCategory,
                        predictedJarKey: response.data.predictedJarKey,
                        predictedType: response.data.predictedType || 'EXPENSE',
                        confidence: response.data.confidence,
                        extractedAmount: response.data.amount || amount
                    }
                };
            } else {
                return {
                    success: false,
                    error: 'Classification failed'
                };
            }
        } catch (error) {
            console.error('AI Service Error:', error.message);

            // Handle different error types
            if (error.code === 'ECONNREFUSED') {
                return {
                    success: false,
                    error: 'AI service is not available. Please ensure the Python API is running.'
                };
            }

            if (error.response) {
                // API returned an error response
                return {
                    success: false,
                    error: error.response.data?.detail || error.response.data?.error || 'AI service error'
                };
            }

            return {
                success: false,
                error: error.message || 'Unknown error occurred'
            };
        }
    }

    /**
     * Classify multiple expenses in batch
     * @param {Array} expenses - Array of {description, userId, amount}
     * @returns {Promise<Object>} Batch classification results
     */
    static async classifyBatch(expenses) {
        try {
            const response = await axios.post(`${AI_API_URL}/classify-batch`, expenses, {
                timeout: 30000, // 30 second timeout for batch
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('AI Service Batch Error:', error.message);
            return {
                success: false,
                error: error.message || 'Batch classification failed'
            };
        }
    }

    /**
     * Check if AI service is available
     * @returns {Promise<boolean>}
     */
    static async isAvailable() {
        try {
            const response = await axios.get(`${AI_API_URL}/health`, {
                timeout: 5000
            });
            return response.data?.status === 'healthy';
        } catch (error) {
            return false;
        }
    }
}

module.exports = AIService;


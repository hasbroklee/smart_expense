/**
 * Anomaly Detection Service
 * Detects unusual expenses and budget violations
 */

const Expense = require('../models/Expense');
const JarConfig = require('../models/JarConfig');

class AnomalyService {
    /**
     * Detect anomalies for a new expense
     * @param {string} userId - User ID
     * @param {string} jarKey - Jar key
     * @param {number} amount - Expense amount
     * @returns {Promise<Object>} Anomaly detection result
     */
    static async detectAnomaly(userId, jarKey, amount) {
        const result = {
            isAnomaly: false,
            reasons: [],
            level: 'normal',
            message: ''
        };

        try {
            // Get historical spending for the jar (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const historicalExpenses = await Expense.find({
                userId,
                jarKey,
                createdAt: { $gte: thirtyDaysAgo }
            });

            // Check for spending anomaly (2.5x mean spending)
            if (historicalExpenses.length > 0) {
                const amounts = historicalExpenses.map(e => e.amount);
                const meanSpending = amounts.reduce((a, b) => a + b, 0) / amounts.length;
                const threshold = meanSpending * 2.5;

                if (amount > threshold) {
                    result.isAnomaly = true;
                    result.reasons.push('ANOMALY');
                    result.level = 'warning';
                    result.message += `Expense is ${(amount / meanSpending).toFixed(2)}x higher than average spending in ${jarKey} jar. `;
                }
            }

            // Check jar monthly limit
            const jarConfig = await JarConfig.getJarByKey(userId, jarKey);

            if (jarConfig && jarConfig.monthlyLimit) {
                const now = new Date();
                const monthlyTotal = await Expense.getMonthlyTotal(
                    userId,
                    jarKey,
                    now.getFullYear(),
                    now.getMonth() + 1
                );

                const projectedTotal = monthlyTotal + amount;

                if (projectedTotal > jarConfig.monthlyLimit) {
                    result.isAnomaly = true;
                    result.reasons.push('JAR_LIMIT');

                    const overage = projectedTotal - jarConfig.monthlyLimit;
                    const overagePercentage = (overage / jarConfig.monthlyLimit) * 100;

                    // Determine severity
                    if (overagePercentage > 20) {
                        result.level = 'critical';
                    } else if (overagePercentage > 10) {
                        result.level = 'warning';
                    } else {
                        result.level = 'info';
                    }

                    result.message += `Expense exceeds monthly limit for ${jarKey} jar. `;
                    result.message += `Current: ${monthlyTotal.toLocaleString()}, `;
                    result.message += `Limit: ${jarConfig.monthlyLimit.toLocaleString()}, `;
                    result.message += `After expense: ${projectedTotal.toLocaleString()} `;
                    result.message += `(${overage.toLocaleString()} over).`;
                }
            }

            // Check total monthly budget
            const userJars = await JarConfig.getUserJars(userId);
            const totalBudget = userJars.reduce((sum, jar) => {
                return sum + (jar.monthlyLimit || 0);
            }, 0);

            if (totalBudget > 0) {
                const now = new Date();
                const totalMonthly = await Expense.aggregate([
                    {
                        $match: {
                            userId,
                            createdAt: {
                                $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                                $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' }
                        }
                    }
                ]);

                const currentTotal = totalMonthly.length > 0 ? totalMonthly[0].total : 0;
                const projectedTotalBudget = currentTotal + amount;

                if (projectedTotalBudget > totalBudget) {
                    result.isAnomaly = true;
                    if (!result.reasons.includes('BUDGET_LIMIT')) {
                        result.reasons.push('BUDGET_LIMIT');
                    }

                    if (result.level === 'normal') {
                        result.level = 'warning';
                    }

                    result.message += `Expense would exceed total monthly budget. `;
                    result.message += `Current: ${currentTotal.toLocaleString()}, `;
                    result.message += `Budget: ${totalBudget.toLocaleString()}.`;
                }
            }

            // Set default message if no issues
            if (!result.isAnomaly) {
                result.message = 'Expense is within normal limits.';
            }

            return result;
        } catch (error) {
            console.error('Anomaly Detection Error:', error);
            return {
                isAnomaly: false,
                reasons: [],
                level: 'normal',
                message: 'Could not perform anomaly detection.'
            };
        }
    }
}

module.exports = AnomalyService;


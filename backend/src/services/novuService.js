import { Novu } from '@novu/api';

class NovuService {
    constructor() {
        this.novu = new Novu({
            secretKey: process.env.NOVU_SECRET_KEY,
            // Add baseUrl if using self-hosted
            ...(process.env.NOVU_API_URL && { baseUrl: process.env.NOVU_API_URL })
        });

        console.log('✅ Novu service initialized');
    }

    /**
     * Register/update a subscriber with their Expo push token
     */
    async registerPushToken(userId, pushToken) {
        try {
            console.log(`📱 Registering push token for user: ${userId}`);

            // Create or update subscriber with push token
            const subscriber = await this.novu.subscribers.identify(userId, {
                firstName: '', // Can be populated later
                lastName: '',
                channels: [
                    {
                        providerId: 'expo',
                        credentials: {
                            deviceTokens: [pushToken]
                        }
                    }
                ]
            });

            console.log(`✅ Push token registered for user: ${userId}`);
            return { success: true, subscriberId: userId };
        } catch (error) {
            console.error('❌ Error registering push token:', error.message);
            throw new Error(`Failed to register push token: ${error.message}`);
        }
    }

    /**
     * Send immediate push notification
     */
    async sendPushNotification(userId, { title, body, data = {} }) {
        try {
            console.log(`📤 Sending push notification to user: ${userId}`);

            const result = await this.novu.trigger({
                workflowId: 'expo-push-notification', // You'll need to create this workflow in Novu
                to: { subscriberId: userId },
                payload: {
                    title,
                    body,
                    data
                }
            });

            console.log(`✅ Push notification sent to user: ${userId}`);
            return {
                success: true,
                transactionId: result.data?.transactionId,
                acknowledged: result.data?.acknowledged
            };
        } catch (error) {
            console.error('❌ Error sending push notification:', error.message);
            throw new Error(`Failed to send push notification: ${error.message}`);
        }
    }

    /**
     * Get subscriber info (useful for debugging)
     */
    async getSubscriber(userId) {
        try {
            const subscriber = await this.novu.subscribers.get(userId);
            return subscriber.data;
        } catch (error) {
            console.error('❌ Error getting subscriber:', error.message);
            throw new Error(`Failed to get subscriber: ${error.message}`);
        }
    }

    /**
     * Health check for Novu connection
     */
    async healthCheck() {
        try {
            // Try to get notification templates as a health check
            await this.novu.workflows.list({ limit: 1 });
            return { status: 'connected', service: 'novu' };
        } catch (error) {
            console.error('❌ Novu health check failed:', error.message);
            return { status: 'error', service: 'novu', error: error.message };
        }
    }
}

// Export singleton instance
export const novuService = new NovuService();
import axios from "axios";

const baseUrl = process.env.EXPO_PUBLIC_PAYMENT_API_URL || 'https://44ovjy9alc.execute-api.us-east-2.amazonaws.com/payment';

async function createPaymentIntent(body: any) {
    const response = await axios.post(`${baseUrl}/create-payment-intent`, body);
    return response.data;
}

async function getPaymentIntent(paymentIntentId: string) {
    const response = await axios.get(`${baseUrl}/${paymentIntentId}`);
    return response.data;
}

const stripeService = {
    createPaymentIntent,
    getPaymentIntent
}

export default stripeService;
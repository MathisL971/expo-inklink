const axios = require('axios');

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

async function verifyUpdates() {
    try {
        console.log('🔍 Verifying accessibility features update...\n');

        const response = await axios.get(`${baseUrl}/events?limit=5`);
        const events = response.data.events || [];

        console.log(`📊 Checking ${events.length} events:\n`);

        events.forEach((event, index) => {
            console.log(`${index + 1}. ${event.title}`);
            console.log(`   Event Type: ${event.eventType}`);
            console.log(`   Accessibility Features: ${event.accessibilityFeatures ?
                (event.accessibilityFeatures.length > 0 ?
                    event.accessibilityFeatures.join(', ') :
                    'None (empty array)') :
                'Field missing'}`);
            console.log(`   Ticket Tiers Available Fields: ${event.ticketTiers ?
                event.ticketTiers.map(tier => `${tier.name}: ${tier.available !== undefined ? tier.available : 'undefined'}`).join(', ') :
                'No ticket tiers'}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error verifying updates:', error.response?.data || error.message);
    }
}

verifyUpdates(); 
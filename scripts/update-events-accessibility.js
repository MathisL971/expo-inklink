const axios = require('axios');

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

// Available accessibility features (matching the schema)
const ACCESSIBILITY_FEATURES = [
    "Wheelchair Accessible",
    "Hearing Assistance (ASL/Interpreters)",
    "Visual Assistance (Large Print/Braille)",
    "Audio Description Available",
    "Closed Captions Available",
    "Sensory-Friendly Environment",
    "Accessible Parking",
    "Accessible Restrooms",
    "Mobility Aid Friendly",
    "Service Animals Welcome"
];

// Function to get random accessibility features for dummy data
function getRandomAccessibilityFeatures() {
    const numFeatures = Math.floor(Math.random() * 4) + 1; // 1-4 features
    const shuffled = [...ACCESSIBILITY_FEATURES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numFeatures);
}

// Function to get all events
async function getAllEvents() {
    try {
        console.log('📥 Fetching all events...');
        const response = await axios.get(`${baseUrl}/events?limit=1000`); // Get up to 1000 events
        return response.data.events || [];
    } catch (error) {
        console.error('❌ Error fetching events:', error.response?.data || error.message);
        throw error;
    }
}

// Function to update a single event
async function updateEvent(event) {
    try {
        // Check if event already has accessibility features
        if (event.accessibilityFeatures && event.accessibilityFeatures.length > 0) {
            console.log(`⏭️  Event "${event.title}" already has accessibility features, skipping...`);
            return { skipped: true };
        }

        // Generate dummy accessibility features based on event type
        let dummyFeatures = [];

        if (event.eventType === "In-Person" || event.eventType === "Hybrid") {
            // In-person events get physical accessibility features
            dummyFeatures = [
                "Wheelchair Accessible",
                "Accessible Parking",
                "Accessible Restrooms"
            ];

            // Add random additional features
            const additionalFeatures = getRandomAccessibilityFeatures().filter(
                feature => !dummyFeatures.includes(feature)
            ).slice(0, 2);
            dummyFeatures = [...dummyFeatures, ...additionalFeatures];
        } else if (event.eventType === "Online") {
            // Online events get digital accessibility features
            dummyFeatures = [
                "Closed Captions Available",
                "Audio Description Available"
            ];

            // Add random additional digital features
            const digitalFeatures = [
                "Hearing Assistance (ASL/Interpreters)",
                "Visual Assistance (Large Print/Braille)",
                "Sensory-Friendly Environment"
            ];
            const additionalFeatures = digitalFeatures.sort(() => 0.5 - Math.random()).slice(0, 2);
            dummyFeatures = [...dummyFeatures, ...additionalFeatures];
        }

        // Fix ticket tiers by adding missing 'available' field
        const fixedTicketTiers = (event.ticketTiers || []).map(tier => ({
            ...tier,
            available: tier.available !== undefined ? tier.available : tier.quantity || 0
        }));

        // Update the event with accessibility features and fixed ticket tiers
        const updatedEventData = {
            ...event,
            accessibilityFeatures: dummyFeatures,
            ticketTiers: fixedTicketTiers
        };

        const response = await axios.put(`${baseUrl}/events/${event.id}`, updatedEventData);

        console.log(`✅ Updated event "${event.title}" with accessibility features: ${dummyFeatures.join(', ')}`);
        return { success: true, features: dummyFeatures };

    } catch (error) {
        console.error(`❌ Error updating event "${event.title}":`, error.response?.data || error.message);
        return { error: true, message: error.response?.data || error.message };
    }
}

// Main function to update all events
async function updateAllEvents() {
    try {
        console.log('🚀 Starting event accessibility features update...\n');

        const events = await getAllEvents();
        console.log(`📊 Found ${events.length} events to process\n`);

        if (events.length === 0) {
            console.log('ℹ️  No events found to update');
            return;
        }

        let successCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        // Update events one by one to avoid overwhelming the API
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            console.log(`[${i + 1}/${events.length}] Processing: ${event.title}`);

            const result = await updateEvent(event);

            if (result.success) {
                successCount++;
            } else if (result.skipped) {
                skippedCount++;
            } else {
                errorCount++;
            }

            // Add a small delay to be respectful to the API
            if (i < events.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log('\n📈 Update Summary:');
        console.log(`✅ Successfully updated: ${successCount} events`);
        console.log(`⏭️  Skipped (already had features): ${skippedCount} events`);
        console.log(`❌ Errors: ${errorCount} events`);
        console.log(`📊 Total processed: ${events.length} events`);

    } catch (error) {
        console.error('💥 Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the update
if (require.main === module) {
    updateAllEvents()
        .then(() => {
            console.log('\n🎉 Event accessibility features update completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Update failed:', error.message);
            process.exit(1);
        });
}

module.exports = { updateAllEvents, getRandomAccessibilityFeatures }; 
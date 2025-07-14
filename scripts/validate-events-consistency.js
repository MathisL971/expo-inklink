const axios = require('axios');

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

// Expected enum values (matching schema)
const VALID_FORMATS = [
    "Lecture", "Conference", "Seminar", "Colloquium", "Symposium", "Panel",
    "Roundtable", "Workshop", "Webinar", "Discussion", "Debate", "Book Talk",
    "Poster Session", "Networking Event", "Training Session", "Keynote",
    "Town Hall", "Fireside Chat"
];

const VALID_DISCIPLINES = [
    "Political Science", "Economics", "History", "Sociology", "Anthropology",
    "Psychology", "Human Geography", "Linguistics", "Archaeology", "Law",
    "Education", "Communication Studies", "Development Studies",
    "International Relations", "Criminology", "Demography", "Social Work",
    "Cultural Studies", "Philosophy"
];

const VALID_ACCESS_LEVELS = ["Public", "Private", "Invitation Only"];
const VALID_EVENT_TYPES = ["In-Person", "Online", "Hybrid"];
const VALID_EVENT_STATUS = ["active", "sold_out", "cancelled"];
const VALID_LANGUAGES = [
    "English", "Spanish", "French", "German", "Chinese (Mandarin)", "Arabic",
    "Russian", "Portuguese", "Japanese", "Italian", "Dutch", "Other"
];

const VALID_ACCESSIBILITY_FEATURES = [
    "Wheelchair Accessible", "Hearing Assistance (ASL/Interpreters)",
    "Visual Assistance (Large Print/Braille)", "Audio Description Available",
    "Closed Captions Available", "Sensory-Friendly Environment",
    "Accessible Parking", "Accessible Restrooms", "Mobility Aid Friendly",
    "Service Animals Welcome"
];

const VALID_VIDEO_PLATFORMS = ["Zoom", "Teams", "Google Meet", "WebEx", "GoToMeeting", "Other"];

// Validation functions
function validateRequired(value, fieldName) {
    if (value === undefined || value === null || value === '') {
        return `${fieldName} is required but missing`;
    }
    return null;
}

function validateEnum(value, validValues, fieldName) {
    if (value && !validValues.includes(value)) {
        return `${fieldName} has invalid value "${value}". Valid values: ${validValues.join(', ')}`;
    }
    return null;
}

function validateArrayEnum(array, validValues, fieldName) {
    if (!Array.isArray(array)) return `${fieldName} should be an array`;
    const invalidValues = array.filter(value => !validValues.includes(value));
    if (invalidValues.length > 0) {
        return `${fieldName} has invalid values: ${invalidValues.join(', ')}. Valid values: ${validValues.join(', ')}`;
    }
    return null;
}

function validateDateOrder(startDate, endDate) {
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            return 'End date must be after start date';
        }
    }
    return null;
}

function validateTicketTiers(ticketTiers) {
    if (!Array.isArray(ticketTiers)) return null;

    const issues = [];
    ticketTiers.forEach((tier, index) => {
        if (!tier.name) issues.push(`Ticket tier ${index + 1}: missing name`);
        if (tier.price === undefined || tier.price < 0) issues.push(`Ticket tier ${index + 1}: invalid price`);
        if (tier.quantity === undefined || tier.quantity < 0) issues.push(`Ticket tier ${index + 1}: invalid quantity`);
        if (tier.available === undefined || tier.available < 0) issues.push(`Ticket tier ${index + 1}: invalid available count`);
        if (tier.available > tier.quantity) issues.push(`Ticket tier ${index + 1}: available (${tier.available}) exceeds quantity (${tier.quantity})`);
    });

    return issues.length > 0 ? issues.join('; ') : null;
}

function validateEventTypeRequirements(event) {
    const issues = [];

    if (event.eventType === "In-Person" || event.eventType === "Hybrid") {
        if (!event.address) {
            issues.push('In-Person/Hybrid events require address information');
        } else {
            if (!event.address.street) issues.push('Address missing street');
            if (!event.address.city) issues.push('Address missing city');
            if (!event.address.state) issues.push('Address missing state');
            if (!event.address.zipCode) issues.push('Address missing zipCode');
            if (!event.address.country) issues.push('Address missing country');
        }
    }

    if (event.eventType === "Online" || event.eventType === "Hybrid") {
        if (!event.videoConference) {
            issues.push('Online/Hybrid events require video conference information');
        } else {
            if (!event.videoConference.platform) issues.push('Video conference missing platform');
            if (!event.videoConference.link) issues.push('Video conference missing link');
            if (event.videoConference.platform && !VALID_VIDEO_PLATFORMS.includes(event.videoConference.platform)) {
                issues.push(`Invalid video conference platform: ${event.videoConference.platform}`);
            }
        }
    }

    return issues.length > 0 ? issues.join('; ') : null;
}

function validateTicketTotals(event) {
    if (!event.ticketTiers || event.ticketTiers.length === 0) return null;

    const calculatedTotal = event.ticketTiers.reduce((sum, tier) => sum + (tier.quantity || 0), 0);
    const calculatedAvailable = event.ticketTiers.reduce((sum, tier) => sum + (tier.available || 0), 0);

    const issues = [];
    if (event.totalTickets !== calculatedTotal) {
        issues.push(`Total tickets mismatch: stored=${event.totalTickets}, calculated=${calculatedTotal}`);
    }
    if (event.availableTickets !== calculatedAvailable) {
        issues.push(`Available tickets mismatch: stored=${event.availableTickets}, calculated=${calculatedAvailable}`);
    }

    return issues.length > 0 ? issues.join('; ') : null;
}

// Main validation function
function validateEvent(event, index) {
    const issues = [];

    // Required fields
    issues.push(validateRequired(event.title, 'title'));
    issues.push(validateRequired(event.description, 'description'));
    issues.push(validateRequired(event.startDate, 'startDate'));
    issues.push(validateRequired(event.endDate, 'endDate'));
    issues.push(validateRequired(event.timezone, 'timezone'));
    issues.push(validateRequired(event.eventType, 'eventType'));
    issues.push(validateRequired(event.format, 'format'));
    issues.push(validateRequired(event.access, 'access'));

    // Enum validations
    issues.push(validateEnum(event.format, VALID_FORMATS, 'format'));
    issues.push(validateEnum(event.access, VALID_ACCESS_LEVELS, 'access'));
    issues.push(validateEnum(event.eventType, VALID_EVENT_TYPES, 'eventType'));
    issues.push(validateEnum(event.status, VALID_EVENT_STATUS, 'status'));

    // Array enum validations
    if (event.disciplines) {
        issues.push(validateArrayEnum(event.disciplines, VALID_DISCIPLINES, 'disciplines'));
    }
    if (event.languages) {
        issues.push(validateArrayEnum(event.languages, VALID_LANGUAGES, 'languages'));
    }
    if (event.accessibilityFeatures) {
        issues.push(validateArrayEnum(event.accessibilityFeatures, VALID_ACCESSIBILITY_FEATURES, 'accessibilityFeatures'));
    }

    // Date validation
    issues.push(validateDateOrder(event.startDate, event.endDate));

    // Event type specific requirements
    issues.push(validateEventTypeRequirements(event));

    // Ticket validation
    issues.push(validateTicketTiers(event.ticketTiers));
    issues.push(validateTicketTotals(event));

    // Numeric field validations
    if (event.totalTickets < 0) issues.push('totalTickets cannot be negative');
    if (event.availableTickets < 0) issues.push('availableTickets cannot be negative');
    if (event.availableTickets > event.totalTickets) {
        issues.push(`availableTickets (${event.availableTickets}) exceeds totalTickets (${event.totalTickets})`);
    }

    // Filter out null issues
    const validIssues = issues.filter(issue => issue !== null);

    return {
        index: index + 1,
        id: event.id,
        title: event.title,
        issues: validIssues
    };
}

// Main function
async function validateAllEvents() {
    try {
        console.log('🔍 Fetching all events for consistency validation...\n');

        // Fetch all events (increase limit to get all)
        const response = await axios.get(`${baseUrl}/events?limit=1000`);
        const events = response.data.events || [];

        console.log(`📊 Validating ${events.length} events...\n`);

        if (events.length === 0) {
            console.log('ℹ️  No events found to validate');
            return;
        }

        // Validate each event
        const validationResults = events.map(validateEvent);

        // Separate valid and invalid events
        const validEvents = validationResults.filter(result => result.issues.length === 0);
        const invalidEvents = validationResults.filter(result => result.issues.length > 0);

        // Display results
        console.log('📈 VALIDATION SUMMARY:');
        console.log(`✅ Valid events: ${validEvents.length}`);
        console.log(`❌ Invalid events: ${invalidEvents.length}`);
        console.log(`📊 Total events: ${events.length}\n`);

        if (invalidEvents.length > 0) {
            console.log('🚨 EVENTS WITH ISSUES:\n');
            invalidEvents.forEach(result => {
                console.log(`❌ [${result.index}] ${result.title} (ID: ${result.id})`);
                result.issues.forEach(issue => {
                    console.log(`   • ${issue}`);
                });
                console.log('');
            });
        }

        if (validEvents.length > 0) {
            console.log('✅ VALID EVENTS:');
            validEvents.forEach(result => {
                console.log(`   • [${result.index}] ${result.title}`);
            });
        }

        // Summary statistics
        console.log('\n📊 FIELD COVERAGE STATISTICS:');
        const fieldStats = {
            hasAccessibilityFeatures: events.filter(e => e.accessibilityFeatures && e.accessibilityFeatures.length > 0).length,
            hasFeaturedGuests: events.filter(e => e.featuredGuests && e.featuredGuests.length > 0).length,
            hasTicketTiers: events.filter(e => e.ticketTiers && e.ticketTiers.length > 0).length,
            hasNote: events.filter(e => e.note && e.note.trim().length > 0).length,
            hasImage: events.filter(e => e.image && e.image.trim().length > 0).length,
            hasAddress: events.filter(e => e.address).length,
            hasVideoConference: events.filter(e => e.videoConference).length,
        };

        Object.entries(fieldStats).forEach(([field, count]) => {
            const percentage = ((count / events.length) * 100).toFixed(1);
            console.log(`   ${field}: ${count}/${events.length} (${percentage}%)`);
        });

        console.log('\n📊 EVENT TYPE DISTRIBUTION:');
        const eventTypes = {};
        events.forEach(event => {
            eventTypes[event.eventType] = (eventTypes[event.eventType] || 0) + 1;
        });
        Object.entries(eventTypes).forEach(([type, count]) => {
            console.log(`   ${type}: ${count} events`);
        });

    } catch (error) {
        console.error('❌ Error during validation:', error.response?.data || error.message);
    }
}

// Run validation
validateAllEvents()
    .then(() => {
        console.log('\n🎉 Event validation completed!');
    })
    .catch(error => {
        console.error('\n💥 Validation failed:', error.message);
        process.exit(1);
    }); 
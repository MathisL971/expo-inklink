const axios = require('axios');

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

async function getAllEvents() {
    try {
        console.log('📥 Fetching all events...');
        const response = await axios.get(`${baseUrl}/events?limit=1000`);
        return response.data.events || [];
    } catch (error) {
        console.error('❌ Error fetching events:', error.response?.data || error.message);
        throw error;
    }
}

function calculateTicketTotals(ticketTiers) {
    if (!Array.isArray(ticketTiers) || ticketTiers.length === 0) {
        return { totalTickets: 0, availableTickets: 0 };
    }

    const totalTickets = ticketTiers.reduce((sum, tier) => sum + (tier.quantity || 0), 0);
    const availableTickets = ticketTiers.reduce((sum, tier) => sum + (tier.available || 0), 0);

    return { totalTickets, availableTickets };
}

async function fixEventTicketTotals(event) {
    try {
        const { totalTickets, availableTickets } = calculateTicketTotals(event.ticketTiers);

        // Check if fix is needed
        if (event.totalTickets === totalTickets && event.availableTickets === availableTickets) {
            console.log(`⏭️  "${event.title}" - ticket totals already correct`);
            return { skipped: true };
        }

        console.log(`🔧 Fixing "${event.title}"`);
        console.log(`   Before: totalTickets=${event.totalTickets}, availableTickets=${event.availableTickets}`);
        console.log(`   After:  totalTickets=${totalTickets}, availableTickets=${availableTickets}`);

        // Update the event
        const updatedEventData = {
            ...event,
            totalTickets,
            availableTickets
        };

        const response = await axios.put(`${baseUrl}/events/${event.id}`, updatedEventData);

        console.log(`✅ Updated "${event.title}" ticket totals`);
        return { success: true, oldTotal: event.totalTickets, newTotal: totalTickets, oldAvailable: event.availableTickets, newAvailable: availableTickets };

    } catch (error) {
        console.error(`❌ Error updating "${event.title}":`, error.response?.data || error.message);
        return { error: true, message: error.response?.data || error.message };
    }
}

async function fixAllTicketTotals() {
    try {
        console.log('🚀 Starting ticket totals fix...\n');

        const events = await getAllEvents();
        console.log(`📊 Found ${events.length} events to process\n`);

        if (events.length === 0) {
            console.log('ℹ️  No events found to fix');
            return;
        }

        let successCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        let totalTicketsFixed = 0;
        let totalAvailableFixed = 0;

        // Process events one by one
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            console.log(`\n[${i + 1}/${events.length}] Processing: ${event.title}`);

            const result = await fixEventTicketTotals(event);

            if (result.success) {
                successCount++;
                totalTicketsFixed += (result.newTotal - result.oldTotal);
                totalAvailableFixed += (result.newAvailable - result.oldAvailable);
            } else if (result.skipped) {
                skippedCount++;
            } else {
                errorCount++;
            }

            // Small delay to be respectful to API
            if (i < events.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        console.log('\n📈 FIX SUMMARY:');
        console.log(`✅ Successfully fixed: ${successCount} events`);
        console.log(`⏭️  Skipped (already correct): ${skippedCount} events`);
        console.log(`❌ Errors: ${errorCount} events`);
        console.log(`📊 Total processed: ${events.length} events`);

        if (successCount > 0) {
            console.log(`\n🎯 TOTALS CORRECTED:`);
            console.log(`   Total tickets added: ${totalTicketsFixed}`);
            console.log(`   Available tickets added: ${totalAvailableFixed}`);
        }

    } catch (error) {
        console.error('💥 Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the fix
if (require.main === module) {
    fixAllTicketTotals()
        .then(() => {
            console.log('\n🎉 Ticket totals fix completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Fix failed:', error.message);
            process.exit(1);
        });
}

module.exports = { fixAllTicketTotals, calculateTicketTotals }; 
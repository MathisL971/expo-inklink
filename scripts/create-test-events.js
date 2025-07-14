const axios = require('axios');

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

const events = [
    {
        title: "Global Climate Change Symposium",
        description: "A comprehensive symposium bringing together leading climate scientists, policy makers, and environmental advocates to discuss the latest research and actionable solutions for climate change mitigation.",
        note: "Reception and networking dinner included. Parking available on-site.",
        image: "https://example.com/climate-symposium.jpg",
        startDate: "2024-03-15T09:00:00Z",
        endDate: "2024-03-15T17:00:00Z",
        timezone: "America/New_York",
        eventType: "In-Person",
        address: {
            street: "123 University Ave",
            city: "Boston",
            state: "Massachusetts",
            zipCode: "02116",
            country: "United States",
            venue: "MIT Climate Center",
            parkingAvailable: "Yes",
            parkingDetails: "Free parking available in the university garage",
            parkingInstructions: "Enter through Gate 2, show event confirmation for free parking",
            parkingCost: "Free"
        },
        source: "MIT Climate Initiative",
        format: "Symposium",
        disciplines: ["Political Science", "Economics", "Human Geography"],
        languages: ["English", "Spanish"],
        access: "Public",
        ticketTiers: [
            {
                id: "student",
                name: "Student",
                price: 25,
                quantity: 100,
                available: 100,
                description: "Discounted rate for students with valid ID"
            },
            {
                id: "general",
                name: "General Admission",
                price: 75,
                quantity: 200,
                available: 200,
                description: "General admission includes lunch and materials"
            },
            {
                id: "premium",
                name: "Premium",
                price: 150,
                quantity: 50,
                available: 50,
                description: "Premium includes VIP reception and signed book"
            }
        ],
        totalTickets: 350,
        availableTickets: 350,
        status: "active",
        featuredGuests: [
            {
                id: "dr-smith",
                name: "Dr. Sarah Smith",
                title: "Climate Scientist",
                bio: "Leading researcher in climate modeling with 15 years of experience",
                organization: "NASA Goddard Institute",
                website: "https://example.com/dr-smith",
                socialMedia: {
                    twitter: "@drclimatesmith",
                    linkedin: "sarah-smith-climate"
                }
            }
        ]
    },
    {
        title: "Digital Democracy and AI Ethics Webinar",
        description: "An interactive online discussion exploring how artificial intelligence is transforming democratic processes and the ethical implications of AI in governance.",
        note: "Q&A session with experts. Recording will be available for 30 days.",
        startDate: "2024-03-20T14:00:00Z",
        endDate: "2024-03-20T16:00:00Z",
        timezone: "Europe/London",
        eventType: "Online",
        videoConference: {
            platform: "Zoom",
            link: "https://zoom.us/j/123456789",
            meetingId: "123 456 789",
            passcode: "AIEthics2024",
            instructions: "Join 15 minutes early for technical check. Polls and breakout rooms will be used."
        },
        source: "Digital Democracy Institute",
        format: "Webinar",
        disciplines: ["Political Science", "Philosophy", "Law"],
        languages: ["English", "French", "German"],
        access: "Public",
        ticketTiers: [
            {
                id: "free",
                name: "Free Access",
                price: 0,
                quantity: 500,
                available: 500,
                description: "Free access to live webinar with Q&A"
            }
        ],
        totalTickets: 500,
        availableTickets: 500,
        status: "active",
        featuredGuests: [
            {
                id: "prof-jones",
                name: "Prof. Michael Jones",
                title: "AI Ethics Researcher",
                bio: "Professor of Computer Science and Ethics at Oxford University",
                organization: "Oxford University",
                website: "https://example.com/prof-jones",
                socialMedia: {
                    twitter: "@aiethicsprof",
                    linkedin: "michael-jones-oxford"
                }
            },
            {
                id: "ms-chen",
                name: "Lisa Chen",
                title: "Policy Analyst",
                bio: "Senior policy analyst specializing in technology governance",
                organization: "European AI Policy Center",
                socialMedia: {
                    linkedin: "lisa-chen-policy"
                }
            }
        ]
    },
    {
        title: "Anthropology of Food Systems Workshop",
        description: "A hands-on workshop exploring the cultural, social, and economic dimensions of food systems across different societies.",
        note: "Includes tasting session and take-home materials. Limited to 30 participants.",
        startDate: "2024-03-25T10:00:00Z",
        endDate: "2024-03-25T15:00:00Z",
        timezone: "America/Los_Angeles",
        eventType: "Hybrid",
        address: {
            street: "456 Research Blvd",
            city: "San Francisco",
            state: "California",
            zipCode: "94102",
            country: "United States",
            venue: "Culinary Anthropology Lab",
            parkingAvailable: "Limited",
            parkingDetails: "Street parking only, meters enforced until 6 PM",
            parkingInstructions: "Arrive early for best parking options",
            parkingCost: "$2.50/hour"
        },
        videoConference: {
            platform: "Teams",
            link: "https://teams.microsoft.com/l/meetup-join/123",
            instructions: "Virtual participants will receive tasting kit by mail"
        },
        source: "SF Anthropology Society",
        format: "Workshop",
        disciplines: ["Anthropology", "Sociology", "Cultural Studies"],
        languages: ["English", "Spanish", "Chinese (Mandarin)"],
        access: "Invitation Only",
        ticketTiers: [
            {
                id: "in-person",
                name: "In-Person",
                price: 120,
                quantity: 20,
                available: 15,
                description: "Includes materials, lunch, and tasting session"
            },
            {
                id: "virtual",
                name: "Virtual",
                price: 80,
                quantity: 50,
                available: 45,
                description: "Virtual participation with mailed tasting kit"
            }
        ],
        totalTickets: 70,
        availableTickets: 60,
        status: "active"
    },
    {
        title: "Economic Psychology Conference",
        description: "Annual conference examining the intersection of psychology and economics, featuring latest research on behavioral economics and decision-making.",
        note: "Poster session and networking lunch included. Student presentations welcome.",
        startDate: "2024-04-02T08:30:00Z",
        endDate: "2024-04-03T17:00:00Z",
        timezone: "America/Chicago",
        eventType: "In-Person",
        address: {
            street: "789 Academic Way",
            city: "Chicago",
            state: "Illinois",
            zipCode: "60601",
            country: "United States",
            venue: "University of Chicago Business School",
            parkingAvailable: "Yes",
            parkingDetails: "Covered parking garage with 200 spaces",
            parkingInstructions: "Validation available at registration desk",
            parkingCost: "$15/day with validation"
        },
        source: "Economic Psychology Association",
        format: "Conference",
        disciplines: ["Economics", "Psychology"],
        languages: ["English"],
        access: "Public",
        ticketTiers: [
            {
                id: "early-bird",
                name: "Early Bird",
                price: 180,
                quantity: 150,
                description: "Early bird pricing until March 15th"
            },
            {
                id: "regular",
                name: "Regular",
                price: 220,
                quantity: 100,
                description: "Regular conference registration"
            },
            {
                id: "student",
                name: "Student",
                price: 50,
                quantity: 80,
                description: "Student rate with valid ID"
            }
        ],
        featuredGuests: [
            {
                id: "dr-wilson",
                name: "Dr. Emma Wilson",
                title: "Behavioral Economics Pioneer",
                bio: "Nobel Prize winner in Economic Sciences 2019",
                organization: "Stanford University",
                website: "https://example.com/dr-wilson"
            }
        ]
    },
    {
        title: "Urban Sociology Roundtable",
        description: "A focused discussion on urban development challenges and community resilience in the 21st century.",
        note: "Interactive format with case studies from major cities worldwide.",
        startDate: "2024-04-10T16:00:00Z",
        endDate: "2024-04-10T18:30:00Z",
        timezone: "Europe/Berlin",
        eventType: "Online",
        videoConference: {
            platform: "Google Meet",
            link: "https://meet.google.com/abc-def-ghi",
            instructions: "Participants will receive background materials 48 hours before the event"
        },
        source: "European Urban Studies Network",
        format: "Roundtable",
        disciplines: ["Sociology", "Human Geography", "Development Studies"],
        languages: ["English", "German", "French"],
        access: "Public",
        ticketTiers: [
            {
                id: "professional",
                name: "Professional",
                price: 45,
                quantity: 25,
                description: "For practicing urban planners and researchers"
            },
            {
                id: "academic",
                name: "Academic",
                price: 25,
                quantity: 35,
                description: "For academic researchers and students"
            }
        ],
        featuredGuests: [
            {
                id: "prof-mueller",
                name: "Prof. Hans Mueller",
                title: "Urban Planning Expert",
                bio: "Director of Urban Studies at Berlin Institute of Technology",
                organization: "TU Berlin",
                socialMedia: {
                    twitter: "@urbanplanprof"
                }
            }
        ]
    },
    {
        title: "Philosophy of Mind Seminar Series",
        description: "A monthly seminar exploring consciousness, cognition, and the nature of mental states in contemporary philosophy.",
        note: "Part of ongoing series. Coffee and refreshments provided.",
        startDate: "2024-04-15T14:00:00Z",
        endDate: "2024-04-15T16:00:00Z",
        timezone: "America/New_York",
        eventType: "In-Person",
        address: {
            street: "100 Philosophy Hall",
            city: "New York",
            state: "New York",
            zipCode: "10027",
            country: "United States",
            venue: "Columbia University Philosophy Department",
            parkingAvailable: "No",
            parkingDetails: "No on-campus parking available",
            parkingInstructions: "Use public transportation or nearby parking garages",
            parkingCost: "N/A"
        },
        source: "Columbia Philosophy Department",
        format: "Seminar",
        disciplines: ["Philosophy", "Psychology"],
        languages: ["English"],
        access: "Public",
        ticketTiers: [
            {
                id: "free",
                name: "Free Admission",
                price: 0,
                quantity: 40,
                description: "Free seminar open to all"
            }
        ]
    },
    {
        title: "International Criminal Law Symposium",
        description: "A comprehensive examination of current developments in international criminal law, human rights, and transitional justice.",
        note: "CLE credits available. Simultaneous interpretation provided.",
        startDate: "2024-04-22T09:00:00Z",
        endDate: "2024-04-22T17:30:00Z",
        timezone: "Europe/Geneva",
        eventType: "Hybrid",
        address: {
            street: "Place des Nations",
            city: "Geneva",
            state: "Geneva",
            zipCode: "1211",
            country: "Switzerland",
            venue: "UN Office at Geneva",
            parkingAvailable: "Limited",
            parkingDetails: "Restricted UN parking with prior authorization",
            parkingInstructions: "Contact organizers for parking permits",
            parkingCost: "Free with permit"
        },
        videoConference: {
            platform: "WebEx",
            link: "https://webex.com/meet/criminallawsymposium",
            meetingId: "987 654 321",
            instructions: "Virtual participants receive materials via email"
        },
        source: "International Criminal Law Society",
        format: "Symposium",
        disciplines: ["Law", "International Relations", "Criminology"],
        languages: ["English", "French", "Spanish"],
        access: "Invitation Only",
        ticketTiers: [
            {
                id: "lawyer",
                name: "Legal Professional",
                price: 300,
                quantity: 60,
                description: "For practicing lawyers and judges"
            },
            {
                id: "academic",
                name: "Academic",
                price: 200,
                quantity: 40,
                description: "For researchers and professors"
            },
            {
                id: "virtual",
                name: "Virtual Access",
                price: 150,
                quantity: 100,
                description: "Virtual participation with materials"
            }
        ],
        featuredGuests: [
            {
                id: "judge-clark",
                name: "Judge Patricia Clark",
                title: "International Criminal Court Judge",
                bio: "Former prosecutor and current judge at the ICC",
                organization: "International Criminal Court",
                website: "https://example.com/judge-clark"
            }
        ]
    },
    {
        title: "Digital Archaeology and Cultural Heritage",
        description: "Exploring how digital technologies are revolutionizing archaeological research and cultural heritage preservation.",
        note: "Hands-on demonstration of 3D scanning technology included.",
        startDate: "2024-05-01T10:00:00Z",
        endDate: "2024-05-01T16:00:00Z",
        timezone: "Europe/Rome",
        eventType: "In-Person",
        address: {
            street: "Via dei Fori Imperiali",
            city: "Rome",
            state: "Lazio",
            zipCode: "00184",
            country: "Italy",
            venue: "Roman Forum Archaeological Site",
            parkingAvailable: "No",
            parkingDetails: "Historical center - no parking available",
            parkingInstructions: "Use public transportation or park outside ZTL zone",
            parkingCost: "N/A"
        },
        source: "Italian Archaeological Society",
        format: "Workshop",
        disciplines: ["Archaeology", "History", "Cultural Studies"],
        languages: ["English", "Italian"],
        access: "Public",
        ticketTiers: [
            {
                id: "standard",
                name: "Standard",
                price: 85,
                quantity: 30,
                description: "Includes site access and materials"
            },
            {
                id: "professional",
                name: "Professional",
                price: 120,
                quantity: 20,
                description: "Includes additional technical sessions"
            }
        ],
        featuredGuests: [
            {
                id: "dr-rossi",
                name: "Dr. Marco Rossi",
                title: "Digital Archaeologist",
                bio: "Pioneer in 3D archaeological documentation",
                organization: "University of Rome",
                socialMedia: {
                    twitter: "@digitalarchaeology"
                }
            }
        ]
    },
    {
        title: "Linguistic Diversity in Multilingual Education",
        description: "A comprehensive panel discussion on preserving linguistic diversity while promoting multilingual education in diverse communities.",
        note: "Presentations in multiple languages with real-time translation.",
        startDate: "2024-05-08T13:00:00Z",
        endDate: "2024-05-08T17:00:00Z",
        timezone: "America/Toronto",
        eventType: "Online",
        videoConference: {
            platform: "Zoom",
            link: "https://zoom.us/j/multilingual2024",
            meetingId: "555 123 456",
            passcode: "LinguisticDiversity",
            instructions: "Real-time translation available in 5 languages"
        },
        source: "Global Linguistics Network",
        format: "Panel",
        disciplines: ["Linguistics", "Education", "Cultural Studies"],
        languages: ["English", "Spanish", "French", "Portuguese", "Arabic"],
        access: "Public",
        ticketTiers: [
            {
                id: "educator",
                name: "Educator",
                price: 30,
                quantity: 100,
                description: "For teachers and educational professionals"
            },
            {
                id: "researcher",
                name: "Researcher",
                price: 40,
                quantity: 80,
                description: "For linguistic researchers and academics"
            },
            {
                id: "student",
                name: "Student",
                price: 15,
                quantity: 120,
                description: "Student discount with valid ID"
            }
        ],
        featuredGuests: [
            {
                id: "prof-garcia",
                name: "Prof. Maria Garcia",
                title: "Multilingual Education Expert",
                bio: "Leading researcher in heritage language maintenance",
                organization: "University of Toronto",
                website: "https://example.com/prof-garcia"
            }
        ]
    },
    {
        title: "Community Development and Social Work Practice",
        description: "A training session focusing on evidence-based community development strategies and their application in social work practice.",
        note: "Continuing education credits available. Case study materials provided.",
        startDate: "2024-05-15T09:00:00Z",
        endDate: "2024-05-15T12:00:00Z",
        timezone: "Australia/Sydney",
        eventType: "Hybrid",
        address: {
            street: "50 Social Work Building",
            city: "Sydney",
            state: "New South Wales",
            zipCode: "2006",
            country: "Australia",
            venue: "University of Sydney School of Social Work",
            parkingAvailable: "Yes",
            parkingDetails: "Campus parking available with permits",
            parkingInstructions: "Purchase daily permit at campus entry",
            parkingCost: "$12 AUD/day"
        },
        videoConference: {
            platform: "Teams",
            link: "https://teams.microsoft.com/socialwork2024",
            instructions: "Virtual participants receive case study materials in advance"
        },
        source: "Australian Social Work Association",
        format: "Training Session",
        disciplines: ["Social Work", "Development Studies", "Sociology"],
        languages: ["English"],
        access: "Public",
        ticketTiers: [
            {
                id: "member",
                name: "ASWA Member",
                price: 95,
                quantity: 40,
                description: "Member rate for association members"
            },
            {
                id: "non-member",
                name: "Non-Member",
                price: 125,
                quantity: 30,
                description: "Regular rate for non-members"
            },
            {
                id: "virtual",
                name: "Virtual Participation",
                price: 65,
                quantity: 60,
                description: "Virtual access with materials"
            }
        ],
        featuredGuests: [
            {
                id: "dr-williams",
                name: "Dr. Sarah Williams",
                title: "Community Development Specialist",
                bio: "20+ years in community development and social work",
                organization: "Sydney Community Services",
                socialMedia: {
                    linkedin: "sarah-williams-community"
                }
            }
        ]
    }
];

async function createEvents() {
    console.log('Creating 10 test events...');

    try {
        const promises = events.map(async (event, index) => {
            try {
                const response = await axios.post(`${baseUrl}/events`, event);
                console.log(`✓ Event ${index + 1} created: ${event.title}`);
                return response.data;
            } catch (error) {
                console.error(`✗ Failed to create event ${index + 1} (${event.title}):`, error.response?.data || error.message);
                return null;
            }
        });

        const results = await Promise.all(promises);
        const successful = results.filter(result => result !== null);

        console.log(`\nCompleted: ${successful.length}/${events.length} events created successfully`);

        if (successful.length > 0) {
            console.log('\nEvent types created:');
            successful.forEach((event, index) => {
                const originalEvent = events[index];
                console.log(`- ${originalEvent.title} (${originalEvent.eventType}, ${originalEvent.format})`);
            });
        }

    } catch (error) {
        console.error('Error creating events:', error);
    }
}

createEvents();